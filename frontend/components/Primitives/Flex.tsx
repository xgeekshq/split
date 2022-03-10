import { styled } from "../../stitches.config";

const Flex = styled("div", {
  display: "flex",
  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
      rowReverse: {
        flexDirection: "row-reverse",
      },
      columnReverse: {
        flexDirection: "column-reverse",
      },
    },
    align: {
      start: {
        alignItems: "flex-start",
      },
      center: {
        alignItems: "center",
      },
      end: {
        alignItems: "flex-end",
      },
      stretch: {
        alignItems: "stretch",
      },
      baseline: {
        alignItems: "baseline",
      },
    },
    justify: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
      between: {
        justifyContent: "space-between",
      },
      around: {
        justifyContent: "space-around",
      },
      evenly: {
        justifyContent: "space-evenly",
      },
    },
    wrap: {
      noWrap: {
        flexWrap: "nowrap",
      },
      wrap: {
        flexWrap: "wrap",
      },
      wrapReverse: {
        flexWrap: "wrap-reverse",
      },
    },
    gap: {
      2: {
        gap: "$2",
      },
      4: {
        gap: "$4",
      },
      6: {
        gap: "$6",
      },
      8: {
        gap: "$8",
      },
      16: {
        gap: "$16",
      },
      20: {
        gap: "$20",
      },
      26: {
        gap: "$26",
      },
      32: {
        gap: "$32",
      },
      40: {
        gap: "$40",
      },
    },
    clickable: {
      true: {
        "@hover": {
          "&:hover": {
            borderColor: "$blue10",
          },
        },
      },
    },
    media: {
      sm: {
        "@sm": { flexDirection: "column" },
      },
    },
  },
  defaultVariants: {
    direction: "row",
  },
});

export default Flex;
