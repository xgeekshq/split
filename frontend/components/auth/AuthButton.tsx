import { ArrowRightIcon } from "@modulz/radix-icons";
import Button from "../Primitives/Button";

type Props = { label: string };

const AuthButton: React.FC<Props> = ({ label }) => {
  return (
    <Button
      color="black"
      size="3"
      css={{
        marginTop: "$20",
        position: "relative",
        "> svg": {
          width: "$20",
          height: "$20",
          position: "absolute",
          right: "$10",
        },
      }}
      type="submit"
    >
      {label}
      <ArrowRightIcon />
    </Button>
  );
};

export default AuthButton;
