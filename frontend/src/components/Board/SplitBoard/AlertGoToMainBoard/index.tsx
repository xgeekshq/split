import Link from 'next/link';

import AlertBox from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '@/components/Primitives/Inputs/Button/Button';

type Props = {
  submitedAt: string | Date;
  mainBoardId: string;
};
const AlertGoToMainBoard: React.FC<Props> = ({ submitedAt, mainBoardId }) => {
  const date = typeof submitedAt === 'string' ? new Date(submitedAt) : submitedAt;

  return (
    <AlertBox
      css={{ flex: '1', width: '100%' }}
      text="The sub-team board can not be edited anymore. If you want to edit cards, go to the main board and edit the according card there."
      title={`Sub-team board successfully merged into main board ${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}
      type="info"
    >
      <Link
        key={mainBoardId}
        href={{
          pathname: `[boardId]`,
          query: { boardId: mainBoardId },
        }}
      >
        <Button size="sm">Go to main board</Button>
      </Link>
    </AlertBox>
  );
};

export default AlertGoToMainBoard;
