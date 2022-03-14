import React, { useState } from "react";
import { SignUpEnum } from "../../../utils/signUp.enum";
import { TabsContent } from "../../Primitives/Tab";
import SignUpForm from "./SignUpForm";
import SignUpOptionsForm from "./SignUpOptionsForm";

const SignUpTabContent: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(SignUpEnum.SIGN_UP); // SIGN_UP, SIGN_UP_OPTIONS, REGISTER

  const conditionalRendering = () => {
    if (showSignUp === SignUpEnum.SIGN_UP) return <SignUpForm setShowSignUp={setShowSignUp} />;
    if (showSignUp === SignUpEnum.SIGN_UP_OPTIONS)
      return <SignUpOptionsForm setShowSignUp={setShowSignUp} />; //return <div>options</div>;
    //  return <RegisterForm />;
    return <div>ola</div>;
  };

  return <TabsContent value="register">{conditionalRendering()}</TabsContent>;
};

export default SignUpTabContent;
