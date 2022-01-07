import { useFormContext } from "react-hook-form";
import Fieldset from "../../Primitives/Fieldset";
import Text from "../../Primitives/Text";
import { User, UserYup } from "../../../types/user";
import Flex from "../../Primitives/Flex";
import { CompoundFieldSetType } from "../../../types/compoundFieldSet";
import HoverCard from "./HoverCardFieldSet";
import Checkbox from "./Checkbox";
import Input from "./Input";
import InputPassword from "./InputPassword";
import Switch from "./Switch";

const mapper = { text: Input, password: InputPassword, checkbox: Checkbox, switch: Switch };

const CompoundFieldSet: React.FC<CompoundFieldSetType> = (props) => {
  const { label, id, inputType, showHoverCard } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext<User>();

  const Component = mapper[inputType];

  return (
    <Fieldset>
      <Component id={id} label={label} register={register} />
      <Flex>
        {errors[id as UserYup] && <Text color="red">{errors[id as UserYup]?.message}</Text>}
        {id === "password" && errors[id] && showHoverCard && <HoverCard />}
      </Flex>
    </Fieldset>
  );
};

export default CompoundFieldSet;
