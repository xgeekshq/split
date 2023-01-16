import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { Accordion } from '@radix-ui/react-accordion';
import { deepClone } from 'fast-json-patch';

import Icon from '@/components/icons/Icon';
import Avatar from '@/components/Primitives/Avatar';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import useBoard from '@/hooks/useBoard';
import SchemaUpdateBoard from '@/schema/schemaUpdateBoardForm';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { UpdateBoardType } from '@/types/board/board';
import { BoardUserToAdd } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { getInitials } from '@/utils/getInitials';
import isEmpty from '@/utils/isEmpty';
import Dialog from '@/components/Primitives/Dialog';
import { styled } from '@/styles/stitches/stitches.config';
import { ConfigurationSettings } from './partials/ConfigurationSettings';
import {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionItem,
  StyledAccordionTrigger,
} from './styles';

const DEFAULT_MAX_VOTES = 6;

const StyledForm = styled('form', { height: 'calc(100% - 89px)' });

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  socketId: string;
  isStakeholderOrAdmin?: boolean | undefined;
  isOwner?: boolean | undefined;
  isSAdmin?: boolean | undefined;
  isResponsible: boolean;
};

const BoardSettings = ({
  isOpen,
  setIsOpen,
  socketId,
  isStakeholderOrAdmin,
  isOwner,
  isSAdmin,
  isResponsible,
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
    },
  } = useRecoilValue(boardInfoState);

  // State used to change values
  const initialData: UpdateBoardType = {
    _id,
    hideCards,
    hideVotes,
    title: boardTitle,
    maxVotes: boardMaxVotes,
    users,
  };

  const [data, setData] = useState<UpdateBoardType>(initialData);

  // References
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  // Unique state to handle the switches change
  const [switchesState, setSwitchesState] = useState<{
    maxVotes: boolean;
    responsible: boolean;
    hideCards: boolean;
    hideVotes: boolean;
  }>({
    maxVotes: false,
    responsible: false,
    hideCards: false,
    hideVotes: false,
  });

  // User Board Hook
  const {
    updateBoard: { mutate },
  } = useBoard({ autoFetchBoard: false });

  const responsible = data.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

  // Use Form Hook
  const methods = useForm<{ title: string; maxVotes?: number | null }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: joiResolver(SchemaUpdateBoard),
    defaultValues: {
      title: data.title,
      maxVotes: data.maxVotes,
    },
  });

  /**
   * Use Effect to run when board change
   * to set title and validate if
   * the value of max votes is not undefined,
   * if yes set the input with this value
   */
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      title: boardTitle,
      maxVotes: boardMaxVotes,
      hideCards,
      hideVotes,
    }));
    methods.setValue('title', boardTitle);
    methods.setValue('maxVotes', boardMaxVotes ?? null);

    setSwitchesState((prev) => ({
      ...prev,
      hideVotes,
      hideCards,
      maxVotes: !isEmpty(boardMaxVotes),
    }));
  }, [boardMaxVotes, boardTitle, hideCards, hideVotes, isOpen, methods]);

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

  const updateBoard = (title: string, maxVotes?: number | null) => {
    mutate(
      {
        ...data,
        title,
        maxVotes,
        socketId,
      },
      {
        onSuccess: () =>
          setSwitchesState({
            hideCards: false,
            maxVotes: false,
            hideVotes: false,
            responsible: false,
          }),
      },
    );
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

  /**
   * Use Effect to submit the board settings form when press enter key
   * (Note: Radix Dialog close when pressing enter)
   */
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (submitBtnRef.current) {
          submitBtnRef.current.click();
        }
      }
    };

    window?.addEventListener('keydown', keyDownHandler);

    return () => window?.removeEventListener('keydown', keyDownHandler);
  }, []);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Header>
        <Text heading="4">Board Settings</Text>
      </Dialog.Header>
      <FormProvider {...methods}>
        <StyledForm
          onSubmit={methods.handleSubmit(({ title, maxVotes }) => updateBoard(title, maxVotes))}
        >
          <Flex direction="column" css={{ height: '100%', justifyContent: 'space-between' }}>
            <Flex direction="column">
              <Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
                <Text heading="4">Board Name</Text>
                <Input
                  forceState
                  id="title"
                  maxChars="30"
                  placeholder="Board Name"
                  state="default"
                  type="text"
                />
              </Flex>

              <Text css={{ display: 'block', px: '$32' }} heading="4">
                Board Settings
              </Text>
              <Accordion type="multiple">
                <StyledAccordionItem value="configurations" variant="first">
                  <StyledAccordionHeader variant="first">
                    <StyledAccordionTrigger>
                      <Text heading="5">Configurations</Text>
                      <StyledAccordionIcon name="arrow-down" />
                    </StyledAccordionTrigger>
                  </StyledAccordionHeader>
                  <StyledAccordionContent>
                    <Flex direction="column" gap={16}>
                      <ConfigurationSettings
                        handleCheckedChange={handleHideCardsChange}
                        isChecked={switchesState.hideCards}
                        text="Participants can not see the cards from other participants of this retrospective."
                        title="Hide cards from others"
                      />

                      {!isSubBoard && (
                        <>
                          <ConfigurationSettings
                            handleCheckedChange={handleHideVotesChange}
                            isChecked={switchesState.hideVotes}
                            text="Participants can not see the votes from other participants of this retrospective."
                            title="Hide votes from others"
                          />
                          <ConfigurationSettings
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
                          </ConfigurationSettings>
                        </>
                      )}
                    </Flex>
                  </StyledAccordionContent>
                </StyledAccordionItem>

                {isSubBoard && (isStakeholderOrAdmin || isOwner || isSAdmin || isResponsible) && (
                  <StyledAccordionItem value="responsible">
                    <StyledAccordionHeader>
                      <StyledAccordionTrigger>
                        <Text heading="5">Team Responsible</Text>
                        <StyledAccordionIcon name="arrow-down" />
                      </StyledAccordionTrigger>
                    </StyledAccordionHeader>
                    <StyledAccordionContent>
                      <Flex direction="column" gap={16}>
                        <ConfigurationSettings
                          isChecked={switchesState.responsible}
                          text="Change responsible participant for this board."
                          title="Team Responsible"
                          handleCheckedChange={handleResponsibleChange}
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
                            <Text
                              css={{
                                mr: '$8',
                                color: '$primary300',
                              }}
                            >
                              Responsible Lottery
                            </Text>
                            <Separator
                              orientation="vertical"
                              css={{
                                '&[data-orientation=vertical]': {
                                  height: '$12',
                                  width: 1,
                                },
                              }}
                            />

                            <Flex
                              align="center"
                              justify="center"
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
                              onClick={handleRandomResponsible}
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
                        </ConfigurationSettings>
                      </Flex>
                    </StyledAccordionContent>
                  </StyledAccordionItem>
                )}
              </Accordion>
            </Flex>
            <Dialog.Footer setIsOpen={setIsOpen} affirmativeLabel="Save" buttonRef={submitBtnRef} />
          </Flex>
        </StyledForm>
      </FormProvider>
    </Dialog>
  );
};

export { BoardSettings };