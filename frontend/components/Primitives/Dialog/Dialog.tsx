import { Root, Overlay } from "@radix-ui/react-dialog";
import { styled, keyframes } from "../../../stitches.config";

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const StyledOverlay = styled(Overlay, {
  backgroundColor: "$blackA9",
  position: "fixed",
  inset: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const Dialog: React.FC = ({ children, ...props }) => {
  return (
    <Root {...props}>
      <StyledOverlay />
      {children}
    </Root>
  );
};

export default Dialog;
