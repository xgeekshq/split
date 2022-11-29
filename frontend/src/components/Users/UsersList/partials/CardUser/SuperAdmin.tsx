import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { Switch, SwitchThumb } from '@/components/Primitives/Switch';
import Icon from '@/components/icons/Icon';
import { useState } from 'react';

type SuperAdminProps = {
  userSAdmin: boolean;
  loggedUserSAdmin: boolean | undefined;
};

const SuperAdmin = ({ userSAdmin, loggedUserSAdmin }: SuperAdminProps) => {
  const [checkedState, setCheckedState] = useState(userSAdmin);

  const handleSuperAdminChange = () => {
    setCheckedState(!checkedState);
  };

  if (loggedUserSAdmin) {
    return (
      <Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
        <Switch checked={checkedState} onCheckedChange={handleSuperAdminChange}>
          {checkedState && (
            <SwitchThumb>
              <Icon
                name="check"
                css={{
                  width: '$14',
                  height: '$14',
                  color: '$successBase',
                }}
              />
            </SwitchThumb>
          )}
          {!checkedState && <SwitchThumb />}
        </Switch>
        <Text css={{ ml: '$14' }} size="sm" weight="medium">
          Super Admin
        </Text>
      </Flex>
    );
  }
  return null;
};

export default SuperAdmin;
