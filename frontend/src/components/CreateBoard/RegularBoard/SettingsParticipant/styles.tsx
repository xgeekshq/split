import { styled } from '@stitches/react';
import { Label } from '@/components/Primitives/RadioGroup';

const LabelStyled = styled(Label, {
  color: '$primary800',
  fontSize: '$14',
  fontWeight: '$bold',
});

const FormStyled = styled('form', {
  width: '100%',
});

export { LabelStyled, FormStyled };
