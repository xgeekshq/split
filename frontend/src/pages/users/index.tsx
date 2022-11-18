import { ReactElement } from 'react';
import { useSession } from 'next-auth/react';

import Layout from 'components/layouts/Layout';
import Flex from 'components/Primitives/Flex';

const Users = () => {
	const { data: session } = useSession({ required: true });

	if (!session) return null; // after getUsers issue, need to add || !data to the if
	return <Flex direction="column" />;
};

Users.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Users;
