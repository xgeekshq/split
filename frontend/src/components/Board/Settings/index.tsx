import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { Accordion } from '@radix-ui/react-accordion';
import { deepClone } from 'fast-json-patch';
import { useRecoilState, useRecoilValue } from 'recoil';

import { colors } from '@/components/Board/Column/partials/OptionsMenu';
import { ColumnSettings } from '@/components/Board/Settings/partials/Columns';
import { ColumnBoxAndDelete } from '@/components/Board/Settings/partials/Columns/ColumnBoxAndDelete';
import { ConfigurationSettings } from '@/components/Board/Settings/partials/ConfigurationSettings';
import SchedulingSettings from '@/components/Board/Settings/partials/Scheduling/Scheduling';
import { TeamResponsibleSettings } from '@/components/Board/Settings/partials/TeamResponsible';
import { ScrollableContent } from '@/components/Boards/MyBoards/ListBoardMembers/styles';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useBoard from '@/hooks/useBoard';
import SchemaUpdateBoard from '@/schema/schemaUpdateBoardForm';
import { boardInfoState, deletedColumnsState } from '@/store/board/atoms/board.atom';
import { FlexForm } from '@/styles/pages/pages.styles';
import { UpdateBoardType, UpdateScheduleType } from '@/types/board/board';
import { BoardUserToAdd } from '@/types/board/board.user';
import ColumnType, { CreateColumn } from '@/types/column';
import { getInitials } from '@/utils/getInitials';
import isEmpty from '@/utils/isEmpty';

const DEFAULT_MAX_VOTES = 6;

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  socketId: string;
  isStakeholderOrAdmin?: boolean | undefined;
  isOwner?: boolean | undefined;
  isSAdmin?: boolean | undefined;
  isResponsible: boolean;
  isRegularBoard?: boolean;
};

const BoardSettings = ({
  isOpen,
  setIsOpen,
  socketId,
  isStakeholderOrAdmin,
  isOwner,
  isSAdmin,
  isResponsible,
  isRegularBoard,
}: Props) => {
  // Recoil State used on [boardId].tsx
  const {
    board: {
      maxVotes: boardMaxVotes,
      title: boardTitle,
      _id,
      hideCards,
      hideVotes,
      users,
      isSubBoard,
      isPublic,
      columns,
      addCards,
      postAnonymously,
    },
    mainBoard,
  } = useRecoilValue(boardInfoState);

  const [deletedColumns, setDeletedColumns] = useRecoilState(deletedColumnsState);

  // State used to change values
  const initialData: UpdateBoardType = {
    _id,
    hideCards,
    hideVotes,
    title: boardTitle,
    maxVotes: boardMaxVotes,
    users,
    isPublic,
    columns,
    addCards,
    postAnonymously,
  };

  const [data, setData] = useState<UpdateBoardType>(initialData);

  const responsible = data.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;
  const hasPermissions = isStakeholderOrAdmin || isOwner || isSAdmin || isResponsible;

  // References
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Unique state to handle the switches change
  const [switchesState, setSwitchesState] = useState<{
    maxVotes: boolean;
    responsible: boolean;
    hideCards: boolean;
    hideVotes: boolean;
    isPublic: boolean;
    addCards: boolean;
    postAnonymously: boolean;
  }>({
    maxVotes: !!initialData?.maxVotes,
    responsible: !!initialData.responsible,
    hideCards: initialData.hideCards,
    hideVotes: initialData.hideVotes,
    isPublic: initialData.isPublic,
    addCards: initialData.addCards,
    postAnonymously: initialData.postAnonymously,
  });

  // State used to change values
  const initialSchedulingData: UpdateScheduleType = {
    reminderViaSlack: false,
    reminderViaEmail: false,
    reminderPrefillingCards: false,
  };

  //state used for scheduling
  const [schedulingData, setSchedulingData] = useState<UpdateScheduleType>(initialSchedulingData);

  // User Board Hook
  const {
    updateBoard: { mutate },
  } = useBoard({ autoFetchBoard: false });

  // Use Form Hook
  const methods = useForm<{
    title: string;
    maxVotes?: number | null;
    formColumns: (ColumnType | CreateColumn)[];
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: joiResolver(SchemaUpdateBoard),
    defaultValues: {
      title: boardTitle,
      maxVotes: boardMaxVotes,
      formColumns: data.columns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'formColumns',
  });

  const handleHideCardsChange = () => {
    setData((prev) => ({
      ...prev,
      hideCards: !prev.hideCards,
    }));
    setSwitchesState((prev) => ({
      ...prev,
      hideCards: !prev.hideCards,
    }));
  };

  const handleHideVotesChange = () => {
    setData((prev) => ({
      ...prev,
      hideVotes: !prev.hideVotes,
    }));
    setSwitchesState((prev) => ({
      ...prev,
      hideVotes: !prev.hideVotes,
    }));
  };

  const handleAddCardsChange = () => {
    setData((prev) => ({
      ...prev,
      addCards: !prev.addCards,
    }));
    setSwitchesState((prev) => ({
      ...prev,
      addCards: !prev.addCards,
    }));
  };

  // Handle the max votes switch change
  const handleMaxVotesChange = (checked: boolean) => {
    setSwitchesState((prev) => ({ ...prev, maxVotes: checked }));

    // Destructuring useForm hook
    const { register, setValue, clearErrors } = methods;

    const value = isEmpty(data.maxVotes) ? DEFAULT_MAX_VOTES : data.maxVotes;

    setData((prev) => ({
      ...prev,
      maxVotes: checked ? value : null,
    }));

    if (!checked) {
      clearErrors('maxVotes');
      setValue('maxVotes', null);
    } else {
      register('maxVotes');
      setValue('maxVotes', value);
    }
  };

  const handleIsPublicChange = () => {
    setData((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
    setSwitchesState((prev) => ({
      ...prev,
      isPublic: !prev.isPublic,
    }));
  };

  const handlePostAnonymouslyChange = () => {
    setData((prev) => ({
      ...prev,
      postAnonymously: !prev.postAnonymously,
    }));
    setSwitchesState((prev) => ({
      ...prev,
      postAnonymously: !prev.postAnonymously,
    }));
  };

  const updateBoard = (
    title: string,
    maxVotes?: number | null,
    formColumns?: (ColumnType | CreateColumn)[],
  ) => {
    const updatedColumns = [...formColumns!].flatMap((column) =>
      column
        ? {
            ...column,
            title: column.title as string,
          }
        : [],
    );

    mutate({
      ...data,
      title,
      maxVotes,
      columns: updatedColumns,
      deletedColumns,
      socketId,
      responsible: data.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE),
      mainBoardId: mainBoard?._id,
    });

    setDeletedColumns([]);
    setIsOpen(false);
  };

  // Responsible Switch Change
  const handleResponsibleChange = (checked: boolean) => {
    setSwitchesState((prev) => ({
      ...prev,
      responsible: checked,
    }));
  };

  // Method to generate a random responsible
  const handleRandomResponsible = () => {
    if (!switchesState.responsible) return;

    const cloneUsers = [...deepClone(data.users)].map((user) => ({
      ...user,
      role: BoardUserRoles.MEMBER,
    }));

    let userFound: BoardUserToAdd | undefined;

    do {
      userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
    } while (userFound?.user._id === responsible?._id);

    if (!userFound) return;

    userFound.role = BoardUserRoles.RESPONSIBLE;

    setData((prev) => ({
      ...prev,
      users: cloneUsers,
    }));
  };

  const handleAddColumn = (e: any) => {
    e.preventDefault();

    append({
      title: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      cards: [],
    });
  };

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <FormProvider {...methods}>
        <FlexForm
          css={{ height: '100%' }}
          direction="column"
          onSubmit={methods.handleSubmit(({ title, maxVotes, formColumns }) => {
            updateBoard(title, maxVotes, formColumns);
          })}
        >
          <Dialog.Header title="Board Settings" />
          <ScrollableContent direction="column" justify="start" ref={scrollRef}>
            <Flex direction="column">
              <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
                <Text heading="4">Board Name</Text>
                <Input showCount id="title" maxChars="45" placeholder="Board Name" type="text" />
              </Flex>

              <Text css={{ display: 'block', px: '$32' }} heading="4">
                Board Settings
              </Text>
              <Accordion type="multiple">
                <ConfigurationSettings>
                  <ConfigurationSwitch
                    handleCheckedChange={handleHideCardsChange}
                    isChecked={switchesState.hideCards}
                    text="Participants can not see the cards from other participants of this retrospective."
                    title="Hide cards from others"
                  />
                  <ConfigurationSwitch
                    handleCheckedChange={handleAddCardsChange}
                    isChecked={switchesState.addCards}
                    text="Allow users to add cards."
                    title="Add cards"
                  />
                  <ConfigurationSwitch
                    handleCheckedChange={handlePostAnonymouslyChange}
                    isChecked={switchesState.postAnonymously}
                    text=" The option to post anonymously is checked by default."
                    title="Post anonymously"
                  />

                  {!isSubBoard && (
                    <>
                      <ConfigurationSwitch
                        handleCheckedChange={handleHideVotesChange}
                        isChecked={switchesState.hideVotes}
                        text="Participants can not see the votes from other participants of this retrospective."
                        title="Hide votes from others"
                      />
                      <ConfigurationSwitch
                        handleCheckedChange={handleMaxVotesChange}
                        isChecked={switchesState.maxVotes}
                        text="Make votes more significant by limiting them."
                        title="Limit votes"
                      >
                        <Input
                          css={{ mt: '$8' }}
                          disabled={!switchesState.maxVotes}
                          id="maxVotes"
                          name="maxVotes"
                          placeholder="Max votes"
                          type="number"
                        />
                      </ConfigurationSwitch>
                    </>
                  )}

                  {isRegularBoard && hasPermissions && (
                    <ConfigurationSwitch
                      handleCheckedChange={handleIsPublicChange}
                      isChecked={switchesState.isPublic}
                      text="If you make this board public anyone with the link to board can access it. Where to find the link? Just copy the URL of the board itself and share it."
                      title="Make board public"
                    />
                  )}
                </ConfigurationSettings>

                {!isSubBoard && hasPermissions && (
                  <SchedulingSettings
                    schedulingData={schedulingData}
                    setSchedulingData={setSchedulingData}
                  />
                )}
                {isSubBoard && hasPermissions && (
                  <TeamResponsibleSettings>
                    <ConfigurationSwitch
                      handleCheckedChange={handleResponsibleChange}
                      isChecked={switchesState.responsible}
                      text="Change responsible participant for this board."
                      title="Team Responsible"
                    >
                      <Flex
                        align="center"
                        css={{
                          mt: '$10',
                          opacity: !switchesState.responsible ? '40%' : 'unset',
                          pointerEvents: !switchesState.responsible ? 'none' : 'unset',
                          transition: 'all 0.25s ease-in-out',
                        }}
                      >
                        <Text color="primary300" css={{ mr: '$8' }}>
                          Responsible Lottery
                        </Text>
                        <Separator orientation="vertical" size="md" />

                        <Flex
                          align="center"
                          justify="center"
                          onClick={handleRandomResponsible}
                          css={{
                            height: '$24',
                            width: '$24',
                            borderRadius: '$round',
                            border: '1px solid $colors$primary400',
                            ml: '$12',
                            cursor: switchesState.responsible ? 'pointer' : 'default',

                            transition: 'all 0.2s ease-in-out',

                            '&:hover': switchesState.responsible
                              ? {
                                  backgroundColor: '$primary400',
                                  color: 'white',
                                }
                              : 'none',
                          }}
                        >
                          <Icon
                            name="wand"
                            css={{
                              width: '$12',
                              height: '$12',
                            }}
                          />
                        </Flex>

                        <Text color="primary800" css={{ mx: '$8' }} size="sm">
                          {!responsible
                            ? 'Responsible not found!'
                            : `${responsible?.firstName} ${responsible?.lastName}`}
                        </Text>

                        <Avatar
                          css={{ position: 'relative' }}
                          size={32}
                          colors={{
                            bg: '$highlight2Lighter',
                            fontColor: '$highlight2Dark',
                          }}
                          fallbackText={getInitials(
                            responsible?.firstName ?? '-',
                            responsible?.lastName ?? '-',
                          )}
                        />
                      </Flex>
                    </ConfigurationSwitch>
                  </TeamResponsibleSettings>
                )}
                {isRegularBoard && (
                  <ColumnSettings>
                    <Flex css={{ height: '$400' }} direction="column">
                      {fields.map((column, index) => (
                        <ColumnBoxAndDelete
                          key={column.id}
                          disableDeleteColumn={fields.length <= 1}
                          index={index}
                          remove={remove}
                        />
                      ))}
                      <Flex direction="row" justify="start">
                        {fields.length < 4 && (
                          <Button onClick={handleAddColumn} size="sm" variant="link">
                            <Icon name="plus" />
                            Add new column
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  </ColumnSettings>
                )}
              </Accordion>
            </Flex>
          </ScrollableContent>
          <Dialog.Footer
            affirmativeLabel="Save"
            buttonRef={submitBtnRef}
            handleClose={() => {
              setIsOpen(false);
            }}
          />
        </FlexForm>
      </FormProvider>
    </Dialog>
  );
};

export { BoardSettings };
