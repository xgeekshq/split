import { UseFormRegister } from "react-hook-form";
import { User } from "./user";

export interface CompoundFieldSetType {
  label: string | (string | JSX.Element)[];
  id: string;
  inputType: "text" | "password" | "checkbox";
  showHoverCard?: boolean;
}

export type ItemCompoundFieldSetType = Pick<CompoundFieldSetType, "id" | "label"> & {
  register: UseFormRegister<User>;
};
