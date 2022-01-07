import { UseFormRegister } from "react-hook-form";
import { User } from "./user";

export interface CompoundFieldSetType {
  label: string | (string | JSX.Element)[];
  id: string;
  inputType: "text" | "password" | "checkbox" | "switch";
  showHoverCard?: boolean;
  variants?: any;
}

export type ItemCompoundFieldSetType = Pick<CompoundFieldSetType, "id" | "label"> & {
  register: () => UseFormRegister<User>;
};
