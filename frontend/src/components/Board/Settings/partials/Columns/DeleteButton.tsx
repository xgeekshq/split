import Flex from '@/components/Primitives/Flex';
import AlertCustomDialog from '@/components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import Tooltip from '@/components/Primitives/Tooltip';
import Icon from '@/components/icons/Icon';
import { DisabledDeleteColumnButton } from './DisabledDeleteButton';

interface Props {
  columnTitle: string;
  handleDeleteColumn: () => void;
  disableDeleteColumn?: boolean;
}

const DeleteColumnButton = ({ columnTitle, handleDeleteColumn, disableDeleteColumn }: Props) => (
  <Flex direction="column">
    <Flex css={{ alignItems: 'center' }}>
      <Flex align="center" css={{ ml: '$24' }} gap="24">
        {disableDeleteColumn ? (
          <DisabledDeleteColumnButton />
        ) : (
          <AlertCustomDialog
            cancelText="Cancel"
            confirmText="Delete"
            css={undefined}
            defaultOpen={false}
            handleConfirm={handleDeleteColumn}
            text={`Do you really want to delete the column ${columnTitle}?`}
            title="Delete column"
          >
            <Tooltip content="Delete column">
              <AlertDialogTrigger asChild>
                <Flex pointer>
                  <Icon
                    name="trash-alt"
                    css={{
                      color: '$primary400',
                      mt: '$16',
                      size: '$20',
                    }}
                  />
                </Flex>
              </AlertDialogTrigger>
            </Tooltip>
          </AlertCustomDialog>
        )}
      </Flex>
    </Flex>
  </Flex>
);

export { DeleteColumnButton };
