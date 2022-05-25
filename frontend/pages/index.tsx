import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useState } from 'react';

import ResetPassword from '../components/auth/ForgotPassword/ResetPassword';
import TroubleLogin from '../components/auth/ForgotPassword/TroubleLogin';
import Index from '../components/auth/LoginForm';
import SignUpTabContent from '../components/auth/SignUp/SignUpTabContent';
import Banner from '../components/icons/Banner';
import { TabsList, TabsRoot, TabsTrigger } from '../components/Primitives/Tab';
import Text from '../components/Primitives/Text';
import { BannerContainer, CenteredContainer, ImageBackground } from '../styles/pages/auth.styles';
import { DASHBOARD_ROUTE } from '../utils/routes';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);
	if (session) {
		return {
			redirect: {
				destination: DASHBOARD_ROUTE,
				permanent: false
			}
		};
	}
	return { props: {} };
};

const Home: NextPage = () => {
	const [currentTab, setCurrentTab] = useState('login');
	const [showTroubleLogin, setShowTroubleLogin] = useState(false);
	return (
		<ImageBackground>
			<BannerContainer>
				<Banner />
			</BannerContainer>
			<CenteredContainer>
				{!showTroubleLogin && (
					<TabsRoot
						value={currentTab}
						onValueChange={(value) => setCurrentTab(value)}
						defaultValue="login"
					>
						<TabsList aria-label="Login or register">
							<TabsTrigger value="login">
								<Text heading="4">Log in</Text>
							</TabsTrigger>
							<TabsTrigger value="register">
								<Text heading="4">Sign up</Text>
							</TabsTrigger>
						</TabsList>
						<LoginForm setShowTroubleLogin={setShowTroubleLogin} />
						<SignUpTabContent setCurrentTab={setCurrentTab} />
					</TabsRoot>
				)}
				{showTroubleLogin && <TroubleLogin setShowTroubleLogin={setShowTroubleLogin} />}
			</CenteredContainer>
		</ImageBackground>
	);
};

export default Home;
