import { TailSpin } from "react-loader-spinner";
import Flex from "../Primitives/Flex";

const SpinnerPage = () => {
  return (
    <Flex>
      <Flex css={{ filter: "blur(1.5rem)" }} />
      <Flex css={{ position: "absolute", top: "40vh", left: "45%" }}>
        <TailSpin height={150} width={150} />
      </Flex>
    </Flex>
  );
};
export default SpinnerPage;
