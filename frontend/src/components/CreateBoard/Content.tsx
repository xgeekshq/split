import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from 'styles/stitches/stitches.config';

import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import useBoard from 'hooks/useBoard';
import SchemaCreateBoard from 'schema/schemaCreateBoardForm';
import { createBoardDataState } from 'store/createBoard/atoms/create-board.atom';
import { CreateBoardDto } from 'types/board/board';
import ClickEvent from 'types/events/clickEvent';
import BoardName from './BoardName';
import SettingsTabs from './SettingsTabs';

const StyledForm = styled('form', Flex, {});

const CreateBoardContent = () => {
	const boardState = useRecoilValue(createBoardDataState);
	const resetBoardState = useResetRecoilState(createBoardDataState);
	const {
		createBoard: { status, mutate }
	} = useBoard({ autoFetchBoard: false });

	const methods = useForm<{ text: string; maxVotes?: number }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			text: 'Main board -',
			maxVotes: boardState.board.maxVotes
		},
		resolver: joiResolver(SchemaCreateBoard)
	});

	const mainBoardName = useWatch({
		control: methods.control,
		name: 'text'
	});

	const handleOnClickSaveBoard = (e: ClickEvent<HTMLButtonElement, MouseEvent>) => {
		e?.preventDefault();
	};

	const saveBoard = (title: string, maxVotes?: number) => {
		const newDividedBoards: CreateBoardDto[] = boardState.board.dividedBoards.map(
			(subBoard) => {
				const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };
				newSubBoard.hideCards = boardState.board.hideCards;
				newSubBoard.hideVotes = boardState.board.hideVotes;
				newSubBoard.maxVotes = maxVotes;
				const users = subBoard.users.map((boardUser) => ({
					user: boardUser.user._id,
					role: boardUser.role
				}));
				newSubBoard.users = users;
				return newSubBoard;
			}
		);

		mutate({
			...boardState.board,
			users: boardState.users,
			title,
			dividedBoards: newDividedBoards,
			maxVotes,
			maxUsers: boardState.count.maxUsersCount.toString()
		});
	};

	useEffect(() => {
		if (status === 'success') {
			resetBoardState();
		}
	}, [status, resetBoardState]);

	return (
		<StyledForm
			css={{ width: '100%', height: '100%', backgroundColor: '$background' }}
			direction="column"
			onSubmit={methods.handleSubmit(({ text, maxVotes }) => {
				saveBoard(text, maxVotes);
			})}
		>
			<Flex
				direction="column"
				css={{
					width: '100%',
					height: '100%',
					pt: '$64',
					pl: '$152',
					pr: '$92',
					overflow: 'auto'
				}}
			>
				<FormProvider {...methods}>
					<BoardName mainBoardName={mainBoardName} />
					<SettingsTabs />
				</FormProvider>
			</Flex>
			<Flex css={{ backgroundColor: 'white', py: '$16', pr: '$32' }} gap="24" justify="end">
				<Button variant="lightOutline" onClick={handleOnClickSaveBoard}>
					Cancel
				</Button>
				<Button type="submit">Create board</Button>
			</Flex>
		</StyledForm>
	);
};

export default CreateBoardContent;
