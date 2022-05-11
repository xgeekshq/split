export interface AuthFieldSetType {
  label: string;
  id: string;
  inputType: string;
  tabValue?: string;
  currentValue?: string;
  setCurrentValue: (value: any) => void;
}
