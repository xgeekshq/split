import { ArrowRightIcon } from "@modulz/radix-icons";
import Button from "../Primitives/Button";

type Props = {
  label: string;
  iconPosition?: "start" | "before-label" | "after-label" | "end";
};

const AuthButton: React.FC<Props> = ({ label, iconPosition = "end" }) => {
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
          mx: "$10",
          position: ["start", "end"].includes(iconPosition) ? "absolute" : "none",
          right: iconPosition === "end" ? "10px" : "none",
          left: iconPosition === "start" ? "10px" : "none",
        },
      }}
      type="submit"
    >
      {iconPosition === "before-label" && <ArrowRightIcon />}
      {label}
      {iconPosition !== "before-label" && <ArrowRightIcon />}
    </Button>
  );
};

export default AuthButton;
