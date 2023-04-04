// Primitive/Box
export type ElevationType = 0 | 1 | 2 | 3 | 4;
export type BoxVariantType = 'bordered' | 'dropdown';

// Primitive/Button
export const ButtonVariant = [
  'primary',
  'primaryOutline',
  'light',
  'lightOutline',
  'danger',
  'dangerOutline',
  'link',
  'transparent',
  'transparentHover',
] as const;

// prettier-ignore
export type ButtonVariantType = typeof ButtonVariant[number];

export const ButtonSize = ['xxs', 'xs', 'sm', 'md', 'lg'] as const;
// prettier-ignore
export type ButtonSizeType = typeof ButtonSize[number];

// Primitive/Flex
export type DirectionType = 'row' | 'column' | 'rowReverse' | 'columnReverse';
export type AlignType = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyType = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type WrapType = 'noWrap' | 'wrap' | 'wrapReverse';
export type GapType = 2 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 22 | 24 | 26 | 32 | 36 | 40;

// Primitive/Text
export type FontWeightType = 'regular' | 'medium' | 'bold';
export type DisplayType = 1 | 2 | 3;
export type HeadingType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Overline = 1 | 2;
export type TextSizeType = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorType =
  | 'white'
  | 'dangerBase'
  | 'primary100'
  | 'primary200'
  | 'primary300'
  | 'primary400'
  | 'primary500'
  | 'primary800';

// Primitive/Popover
export type PopoverVariantType = 'dark' | 'light';
export type PopoverSizeType = 'sm' | 'md';

// Primitive/RadioGroup
export type RadioGroupDirectionType = 'row' | 'column';
export type RadioGroupSizeType = 'sm' | 'md' | 'lg';
export type RadioGroupFontWeightType = 'regular' | 'medium' | 'bold';

// Primitive/Separator
export type SeparatorOrientationType = 'horizontal' | 'vertical';
export type SeparatorSizeType = 'sm' | 'md' | 'lg' | 'full';

// Primitive/Svg
export type SvgSizeType = 12 | 16 | 18 | 20 | 24 | 32 | 40 | 48 | 100;

// Primitive/Switch
export type SwitchSizeType = 'xs' | 'sm' | 'md';

// Primitive/Loading/Spinner
export type SpinnerSizeType = 50 | 80 | 100 | 150 | 200;
export type SpinnerColorType = 'light' | 'dark';

// Primitive/Loading/Dots
export type DotsSizeType = 8 | 4 | 10 | 15 | 50 | 80 | 100;
export type DotsColorType = 'primary800' | 'primary200' | 'white';

// Primitive/Badge
export type BadgeSizeType = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeVariants = 'success' | 'danger' | 'info' | 'warning';
