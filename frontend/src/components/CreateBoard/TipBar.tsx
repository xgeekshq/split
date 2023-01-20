import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const TextWhite = styled(Text, { color: 'white', mt: '$24' });
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
      minHeight: 'calc(100vh - $sizes$92 - $sizes$81)',
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
        <TextWhite heading="6">Sub-teams</TextWhite>
        <UnorderedList>
          <LiWhite>The participants of the sub-teams are generated randomly.</LiWhite>

          <LiWhite>The number of participants is split equally between all sub-teams.</LiWhite>

          <LiWhite>For each sub-team there is one responsible selected.</LiWhite>
        </UnorderedList>
        <TextWhite heading="6">Responsibles</TextWhite>
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
        <TextWhite css={{ mb: '$8' }} heading="6">
          Stakeholder
        </TextWhite>
        <LiWhite as="span">The stakeholder will not be assigned to any sub-team.</LiWhite>
      </>
    )}
    {isRegularBoard && (
      <>
        <TextWhite heading="6">Quick create board</TextWhite>
        <LiWhite as="span">
          If you want to jump the settings you can just hit the button <b>Create board</b>. You can
          still adjust all the settings later on inside the board itself.
        </LiWhite>
        <TextWhite heading="6">Columns</TextWhite>
        <LiWhite as="span">
          We will set the columns by default to 3. If you want to have more or less you can later,
          inside the actual board, still adjust the columns.
        </LiWhite>
      </>
    )}
  </Flex>
);

export default CreateBoardTipBar;
