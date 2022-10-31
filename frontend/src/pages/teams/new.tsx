import { dehydrate, QueryClient, useQuery } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useSetRecoilState } from 'recoil';

import { getAllUsers } from '../../api/userService';
import requireAuthentication from '../../components/HOC/requireAuthentication';
import CreateTeam from '../../components/Teams/CreateTeam';
import { toastState } from '../../store/toast/atom/toast.atom';
import { ToastStateEnum } from '../../utils/enums/toast-types';

const NewTeam: NextPage = () => {
	const setToastState = useSetRecoilState(toastState);

	const { data } = useQuery(['users'], () => getAllUsers(), {
		enabled: true,
		refetchOnWindowFocus: false,
		onError: () => {
			setToastState({
				open: true,
				content: 'Error getting the users',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return <CreateTeam usersList={data} />;
};

export default NewTeam;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async (context: GetServerSidePropsContext) => {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery('users', () => getAllUsers(context));

		return {
			props: {
				dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
			}
		};
	}
);
