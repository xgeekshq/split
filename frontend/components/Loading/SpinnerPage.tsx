import { TailSpin } from "react-loader-spinner";
import Flex from "../Primitives/Flex";

const SpinnerPage = () => {
  return (
    <Flex>
      <Flex css={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(80, 80, 89, 0.2)" }} />
      <Flex css={{ position: "absolute", top: "40vh", left: "45%" }}>
        <TailSpin height={150} width={150} color="#060D16" />
      </Flex>
    </Flex>
  );
};
export default SpinnerPage;
