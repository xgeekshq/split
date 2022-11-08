import { useCallback, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import {
	ButtonsContainer,
	Container,
	ContentContainer,
	InnerContent,
	PageHeader,
	StyledForm,
	SubContainer
} from 'styles/pages/boards/new.styles';

import { getAllTeams } from 'api/teamService';
import BoardName from 'components/CreateBoard/BoardName';
import FakeSettingsTabs from 'components/CreateBoard/fake/FakeSettingsTabs';
import SettingsTabs from 'components/CreateBoard/SettingsTabs';
import TipBar from 'components/CreateBoard/TipBar';
import requireAuthentication from 'components/HOC/requireAuthentication';
import Icon from 'components/icons/Icon';
import AlertBox from 'components/Primitives/AlertBox';
import Button from 'components/Primitives/Button';
import Text from 'components/Primitives/Text';
import useBoard from 'hooks/useBoard';
import SchemaCreateBoard from 'schema/schemaCreateBoardForm';
import { createBoardDataState, createBoardError } from 'store/createBoard/atoms/create-board.atom';
import { toastState } from 'store/toast/atom/toast.atom';
import { CreateBoardDto } from 'types/board/board';
import { TeamUserRoles } from 'utils/enums/team.user.roles';
import { ToastStateEnum } from 'utils/enums/toast-types';

const NewBoard: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession({ required: true });
	const { data: teams } = useQuery(['teams'], () => getAllTeams(), { suspense: false });
	/**
	 * Recoil Atoms and Hooks
	 */
	const setToastState = useSetRecoilState(toastState);
	const boardState = useRecoilValue(createBoardDataState);
	const resetBoardState = useResetRecoilState(createBoardDataState);
	const [haveError, setHaveError] = useRecoilState(createBoardError);

	/**
	 * User Board Hook
	 */
	const {
		createBoard: { status, mutate }
	} = useBoard({ autoFetchBoard: false });

	/**
	 * React Hook Form
	 */
	const methods = useForm<{ text: string; maxVotes?: number; slackEnable?: boolean }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			text: '',
			maxVotes: boardState.board.maxVotes,
			slackEnable: false
		},
		resolver: joiResolver(SchemaCreateBoard)
	});

	const mainBoardName = useWatch({
		control: methods.control,
		name: 'text'
	});

	/**
	 * Handle back to previous route
	 */
	const handleBack = useCallback(() => {
		resetBoardState();
		router.back();
	}, [router, resetBoardState]);

	/**
	 * Save board
	 * @param title Board Title
	 * @param maxVotes Maxium number of votes allowed
	 */
	const saveBoard = (title: string, maxVotes?: number, slackEnable?: boolean) => {
		const newDividedBoards: CreateBoardDto[] = boardState.board.dividedBoards.map(
			(subBoard) => {
				const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };
				newSubBoard.hideCards = boardState.board.hideCards;
				newSubBoard.hideVotes = boardState.board.hideVotes;
				newSubBoard.maxVotes = maxVotes;

				newSubBoard.users = subBoard.users.map((boardUser) => ({
					user: boardUser.user._id,
					role: boardUser.role
				}));

				return newSubBoard;
			}
		);

		mutate({
			...boardState.board,
			users: boardState.users,
			title,
			dividedBoards: newDividedBoards,
			maxVotes,
			slackEnable,
			maxUsers: boardState.count.maxUsersCount
		});
	};

	useEffect(() => {
		const isAdminOrStakeHolder = teams
			? teams[0].users.find(
					(teamUser) =>
						teamUser.user._id === session?.user.id &&
						[TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role)
			  ) || session?.isSAdmin
			: false;
		if (!isAdminOrStakeHolder && !haveError) {
			setHaveError(!isAdminOrStakeHolder);
		}

		if (status === 'success') {
			setToastState({
				open: true,
				content: 'Board created with success!',
				type: ToastStateEnum.SUCCESS
			});

			resetBoardState();
			router.push('/boards');
		}
	}, [status, resetBoardState, router, setToastState, session, haveError, teams, setHaveError]);

	return (
		<Container>
			<PageHeader>
				<Text color="primary800" heading={3} weight="bold">
					Add new SPLIT board
				</Text>

				<Button isIcon onClick={handleBack}>
					<Icon name="close" />
				</Button>
			</PageHeader>
			<ContentContainer>
				<SubContainer>
					{haveError && (
						<AlertBox
							text="In order to create a SPLIT retrospective, you need to have a team with an amount of people big enough to be splitted into smaller sub-teams. Also you need to be team-admin to create SPLIT retrospectives."
							title="No team yet!"
							type="error"
							css={{
								marginTop: '$20'
							}}
						/>
					)}

					<StyledForm
						direction="column"
						status={!haveError}
						onSubmit={
							!haveError
								? methods.handleSubmit(({ text, maxVotes, slackEnable }) => {
										saveBoard(text, maxVotes, slackEnable);
								  })
								: undefined
						}
					>
						<InnerContent direction="column">
							<FormProvider {...methods}>
								<BoardName mainBoardName={mainBoardName} />
								{haveError ? <FakeSettingsTabs /> : <SettingsTabs />}
							</FormProvider>
						</InnerContent>
						<ButtonsContainer gap="24" justify="end">
							<Button type="button" variant="lightOutline" onClick={handleBack}>
								Cancel
							</Button>
							<Button type="submit">Create board</Button>
						</ButtonsContainer>
					</StyledForm>
				</SubContainer>
				<TipBar />
			</ContentContainer>
		</Container>
	);
};

export default NewBoard;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context: GetServerSidePropsContext) => {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery('teams', () => getAllTeams(context));

		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
);
