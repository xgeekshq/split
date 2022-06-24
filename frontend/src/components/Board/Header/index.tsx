import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';

import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import CardAvatars from 'components/CardBoard/CardAvatars';
import Icon from 'components/icons/Icon';
import LogoIcon from 'components/icons/Logo';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import Tooltip from 'components/Primitives/Tooltip';
import { boardInfoState } from 'store/board/atoms/board.atom';
import BoardType from 'types/board/board';
import { BoardUser, BoardUserNoPopulated } from 'types/board/board.user';
import { BreadcrumbType } from 'types/board/Breadcrumb';
import {
	BoardCounter,
	MergeIconContainer,
	RecurrentIconContainer,
	StyledBoardLink,
	StyledHeader,
	StyledLogo,
	StyledPopoverArrow,
	StyledPopoverContent,
	StyledPopoverItem,
	TitleSection
} from './styles';

const BoardHeader = () => {
	const { data: session } = useSession({ required: true });

	// Atoms
	const boardData = useRecoilValue(boardInfoState);

	// Get Board Info
	const { title, recurrent, users, team, dividedBoards, isSubBoard, submitedAt } =
		boardData!.board;

	// Found sub-board
	const getSubBoard = (): { id: string; title: string } | undefined => {
		const boardInfo = dividedBoards.find((board: BoardType) =>
			board.users.find(
				(user) => (user as unknown as BoardUserNoPopulated).user === session?.user?.id
			)
		);

		if (boardInfo) {
			return {
				id: boardInfo._id,
				title: boardInfo.title
			};
		}

		return undefined;
	};

	// Set breadcrumbs
	const breadcrumbItems: BreadcrumbType = [
		{
			title: 'Boards',
			link: '/boards'
		}
	];

	if (isSubBoard && !!boardData?.mainBoardData) {
		const { title: mainTitle, id: mainId } = boardData.mainBoardData;

		breadcrumbItems.push(
			{
				title: mainTitle,
				link: `/boards/${mainId}`
			},
			{
				title,
				isActive: true
			}
		);
	} else {
		breadcrumbItems.push({
			title,
			isActive: true
		});
	}
	return (
		<StyledHeader>
			<Flex align="center" justify="between" gap="20">
				<Flex direction="column">
					<Flex gap={!isSubBoard ? 26 : undefined} align="center">
						<Breadcrumb items={breadcrumbItems} />

						{!isSubBoard && !!getSubBoard() && (
							<Flex align="center" gap={10}>
								<Separator
									data-orientation="vertical"
									css={{ height: '$14 !important' }}
								/>
								<Link href={{
									pathname: `[boardId]`,
									query: { boardId: getSubBoard()?.id, mainBoardId: boardData?.board._id }
								}}>
									<StyledBoardLink>
										{getSubBoard()?.title.replace('team ', '')}
									</StyledBoardLink>
								</Link>
							</Flex>
						)}
					</Flex>
					<TitleSection>
						<StyledLogo>
							<LogoIcon />
						</StyledLogo>
						<Text heading="2">{title}</Text>

						{recurrent && (
							<Tooltip content="Occurs every X week">
								<RecurrentIconContainer>
									<Icon name="recurring" />
								</RecurrentIconContainer>
							</Tooltip>
						)}

						{isSubBoard && !submitedAt && (
							<Tooltip content="Unmerged">
								<MergeIconContainer isMerged={!!submitedAt}>
									<Icon name="merge" />
								</MergeIconContainer>
							</Tooltip>
						)}
					</TitleSection>
				</Flex>
				<Flex align="center" gap="24">
					<Flex align="center" gap="10">
						<Text color="primary800" size="sm" css={{ fontWeight: 500 }}>
							{isSubBoard ? title.replace('board', '') : team.name}
						</Text>
						<CardAvatars
							listUsers={users}
							responsible={false}
							teamAdmins={false}
							userId={session!.user.id}
						/>
					</Flex>

					{(boardData!.board.users || users).filter(
						(user: BoardUser) => user.role === 'stakeholder'
					).length > 0 && (
						<>
							<Separator
								data-orientation="vertical"
								css={{ height: '$24 !important' }}
							/>

							<Flex align="center" gap="10">
								<Text color="primary300" size="sm">
									Stakeholders
								</Text>
								<CardAvatars
									listUsers={users}
									responsible={false}
									teamAdmins={false}
									stakeholders
									userId={session!.user.id}
								/>
							</Flex>
						</>
					)}
				</Flex>
			</Flex>

			{!isSubBoard && (
				<Popover>
					<PopoverTrigger asChild>
						<BoardCounter>
							<Icon name="info" />
							{
								dividedBoards.filter(
									(dividedBoard: BoardType) => dividedBoard.submitedAt
								).length
							}{' '}
							of {dividedBoards.length} sub-team boards merged
						</BoardCounter>
					</PopoverTrigger>
					<StyledPopoverContent>
						<Flex direction="column">
							{dividedBoards.map((board: BoardType) => (
								<StyledPopoverItem
									key={board.title.toLowerCase().split(' ').join('-')}
								>
									<p>{board.title}</p>

									<div>
										{board.submitedAt ? 'Merged' : 'Unmerged'}
										<MergeIconContainer isMerged={!!board.submitedAt}>
											<Icon name="merge" />
										</MergeIconContainer>{' '}
									</div>
								</StyledPopoverItem>
							))}
						</Flex>

						<StyledPopoverArrow />
					</StyledPopoverContent>
				</Popover>
			)}
		</StyledHeader>
	);
};

export default BoardHeader;
