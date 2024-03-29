import React, { Dispatch, useState } from 'react';

import RegisterForm from '@/components/auth/SignUp/RegisterForm';
import SignUpForm from '@/components/auth/SignUp/SignUpForm';
import SignUpOptionsForm from '@/components/auth/SignUp/SignUpOptionsForm';
import { SignUpEnum } from '@/enums/auth/signUp';

interface SignUpTabContentProps {
  setCurrentTab: Dispatch<React.SetStateAction<string>>;
}

const SignUpTabContent = ({ setCurrentTab }: SignUpTabContentProps) => {
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

  return conditionalRendering();
};

export default SignUpTabContent;
