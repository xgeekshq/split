import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const LiWhite = styled('li', Text, { color: '$primary100', fontSize: '$14', lineHeight: '$20' });
const UnorderedList = styled('ul', { paddingInlineStart: '$26' });

type CreateBoardTipBarProps = {
  isSplitBoard?: boolean;
  isRegularBoard?: boolean;
};

const CreateBoardTipBar = ({ isSplitBoard, isRegularBoard }: CreateBoardTipBarProps) => (
  <Flex
    direction="column"
    css={{
      backgroundColor: '$primary800',
      padding: '$32',
      pt: '$100',
      maxWidth: '$384',
      right: 0,
      top: 0,
      bottom: 0,
    }}
  >
    <Icon
      name="blob-idea"
      css={{
        width: '47px',
        height: '$48',
      }}
    />
    {isSplitBoard && (
      <>
        <Text heading="6" color="white" css={{ mt: '$24' }}>
          Sub-teams
        </Text>
        <UnorderedList>
          <LiWhite>The participants of the sub-teams are generated randomly.</LiWhite>

          <LiWhite>The number of participants is split equally between all sub-teams.</LiWhite>

          <LiWhite>For each sub-team there is one responsible selected.</LiWhite>
        </UnorderedList>
        <Text heading="6" color="white" css={{ mt: '$24' }}>
          Responsibles
        </Text>
        <UnorderedList>
          <LiWhite>
            Responsibles are normal users with the rights to merge the cards at the end of each
            sub-teams retro into the main board.
          </LiWhite>

          <LiWhite>
            Responsibles also are in charge of scheduling and conducting the sub-teams
            retrospective.
          </LiWhite>
        </UnorderedList>
        <Text css={{ mt: '$24' }} heading="6" color="white">
          Stakeholder
        </Text>
        <UnorderedList>
          <LiWhite>The stakeholder will not be assigned to any sub-team.</LiWhite>
        </UnorderedList>
      </>
    )}
    {isRegularBoard && (
      <>
        <Text color="white" heading="6" css={{ mt: '$24' }}>
          Quick create board
        </Text>
        <UnorderedList>
          <LiWhite>
            If you want to jump the settings you can just hit the button <b>Create board</b>. You
            can still adjust all the settings later on inside the board itself.
          </LiWhite>
        </UnorderedList>
        <Text color="white" heading="6" css={{ mt: '$24' }}>
          Columns
        </Text>
        <UnorderedList>
          <LiWhite>
            We will set the columns by default to 3. If you want to have more or less you can later,
            inside the actual board, still adjust the columns.
          </LiWhite>
        </UnorderedList>
      </>
    )}
  </Flex>
);

export default CreateBoardTipBar;
