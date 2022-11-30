import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { Switch, SwitchThumb } from '@/components/Primitives/Switch';
import Icon from '@/components/icons/Icon';
import { useState } from 'react';

import Separator from '@/components/Primitives/Separator';

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
        <Separator
          orientation="vertical"
          css={{
            ml: '$20',
            backgroundColor: '$primary100',
            height: '$24 !important',
          }}
        />
      </Flex>
    );
  }
  return (
    <Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
      {userSAdmin && (
        <Text
          css={{
            ml: '$14',
            background: '#E3FFF5',
            borderStyle: 'solid',
            borderColor: '#3EC796',
            borderWidth: 'thin',
            color: '#3EC796',
            borderRadius: '$12',
            padding: '$8',
            height: '1.55rem',
            lineHeight: '$8',
          }}
          size="sm"
          weight="medium"
        >
          SUPER ADMIN
        </Text>
      )}
>>>>>>> bd6d377 (feat: member only sees user teams count and which user is an admin)
    </Flex>
  );
};
export default SuperAdmin;
