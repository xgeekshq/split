import React, { useState } from "react";
import Flex from "../../components/Primitives/Flex";
import LoginForm from "../../components/auth/LoginForm";
import TextButton from "../Primitives/TextButton";
import RegisterForm from "./RegisterForm";
import AuthIcons from "./AuthIcons";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const onClick = () => {
    setIsLogin(!isLogin);
  };

  if (isLogin)
    return (
      <div>
        <h2>Sign In</h2>
        <Flex direction="column" align="center">
          <LoginForm />
          <AuthIcons />
          <TextButton text="Forgot your password?" onClick={onClick} type="secondary" /> 
          <span>
            Don’t have an account yet? <TextButton text="Register" onClick={onClick} />
          </span>
        </Flex>
      </div>
    );

  return (
    <div>
      <h2>Sign Up</h2>
      <Flex direction="column" align="center">
        <RegisterForm />
        <AuthIcons />
        <p>
          Already have an account? <TextButton text="Sign In" onClick={onClick} />
        </p>
      </Flex>
    </div>
  );
};

export default Auth;
