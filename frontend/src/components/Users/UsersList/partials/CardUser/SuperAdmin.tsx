import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { useState } from 'react';
import { ConfigurationSettings } from '@/components/Board/Settings/partials/ConfigurationSettings';

import Separator from '@/components/Primitives/Separator';
import useUser from '@/hooks/useUser';
import { UpdateUserIsAdmin } from '@/types/user/user';

type SuperAdminProps = {
  userSAdmin: boolean;
  loggedUserSAdmin: boolean | undefined;
  userId: string;
};

const SuperAdmin = ({ userSAdmin, loggedUserSAdmin, userId }: SuperAdminProps) => {
  const [checkedState, setCheckedState] = useState(userSAdmin);

  const {
    updateUserIsAdmin: { mutate },
  } = useUser();

  const handleSuperAdminChange = (checked: boolean) => {
    const updateTeamUser: UpdateUserIsAdmin = {
      _id: userId,
      isSAdmin: checked,
    };

    setCheckedState(checked);
    mutate(updateTeamUser);
  };

  if (loggedUserSAdmin) {
    return (
      <Flex css={{ ml: '$2', display: 'flex', alignItems: 'center' }}>
        <ConfigurationSettings
          handleCheckedChange={handleSuperAdminChange}
          isChecked={checkedState}
          text=""
          title="Super Admin"
        />

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
    </Flex>
  );
};
export default SuperAdmin;
