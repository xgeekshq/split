import { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { styled } from "../../../stitches.config";

const StyledSelect = styled(Select, {
  height: "$36 !important",

  ".react-select__control": {
    border: "1px solid $colors$primary100",
    borderRadius: "0 12px 12px 0",
    maxHeight: "$36 !important",
    height: "$36 !important",
    minHeight: "$36 !important",
    backgroundColor: "$background !important",
    color: "$primary300",
    fontSize: "$14 !important",
    lineHeight: "$20 !important",
    fontWeight: "$medium !important",
    boxShadow: "none !important",

    "&>*>*": {
      color: "$primary300",
    },

    "&:hover,&:focus": {
      borderColor: "$primary800",
    },

    "&.react-select__control--menu-is-open": {
      borderColor: "$primary800",
      color: "$primary800 !important",

      "&>*>*": {
        color: "$primary800 !important",
      },
    },
  },
});

interface OptionType {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: OptionType[];
  setFilter: Dispatch<SetStateAction<string>>;
  filter: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ filter, options, setFilter }) => {
  const isSelected = filter !== "all" && filter !== "personal";
  return (
    <StyledSelect
      options={options}
      className="react-select-container"
      classNamePrefix="react-select"
      value={
        !isSelected
          ? { label: "Select", value: "" }
          : options.find((option) => option.value === filter)
      }
      onChange={(selectedOption) => {
        setFilter((selectedOption as OptionType)?.value);
      }}
    />
  );
};

export default FilterSelect;
