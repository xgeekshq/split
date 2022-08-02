import React, { Dispatch, useState } from 'react';

import { TabsContent } from 'components/Primitives/Tab';
import { SignUpEnum } from 'utils/signUp.enum';
import RegisterForm from './RegisterForm';
import SignUpForm from './SignUpForm';
import SignUpOptionsForm from './SignUpOptionsForm';

interface SignUpTabContentProps {
	setCurrentTab: Dispatch<React.SetStateAction<string>>;
}

const SignUpTabContent: React.FC<SignUpTabContentProps> = ({ setCurrentTab }) => {
	const [showSignUp, setShowSignUp] = useState(SignUpEnum.SIGN_UP);
	const [emailName, setEmailName] = useState({ email: '', goback: false });
	const conditionalRendering = () => {
		if (showSignUp === SignUpEnum.SIGN_UP)
			return (
				<SignUpForm
					emailName={emailName}
					setEmailName={setEmailName}
					setShowSignUp={setShowSignUp}
				/>
			);
		if (showSignUp === SignUpEnum.SIGN_UP_OPTIONS)
			return (
				<SignUpOptionsForm
					emailName={emailName.email}
					setEmailName={setEmailName}
					setShowSignUp={setShowSignUp}
				/>
			);
		return (
			<RegisterForm
				emailName={emailName}
				setCurrentTab={setCurrentTab}
				setEmailName={setEmailName}
				setShowSignUp={setShowSignUp}
			/>
		);
	};

	return <TabsContent value="register">{conditionalRendering()}</TabsContent>;
};

export default SignUpTabContent;
