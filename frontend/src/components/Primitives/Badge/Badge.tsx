import { styled } from '@/styles/stitches/stitches.config';

const Badge = styled('span', {
  color: '$primary400',
  border: '1px solid $primary100',
  borderRadius: '$4',
  px: '$8',
  py: '$2',
  fontSize: '$16',
  lineHeight: '$24',
  variants: {
    variant: {
      success: {
        background: '$successLightest',
        borderColor: '$successBase',
        color: '$successBase',
      },
      danger: {
        background: '$dangerLightest',
        borderColor: '$dangerBase',
        color: '$dangerBase',
      },
      info: {
        background: '$infoLightest',
        borderColor: '$infoBase',
        color: '$infoBase',
      },
      warning: {
        background: '$warningLightest',
        borderColor: '$warningBase',
        color: '$warningBase',
      },
    },
    size: {
      lg: {
        fontSize: '$20',
        lineHeight: '$28',
      },
      md: {
        fontSize: '$16',
        lineHeight: '$24',
      },
      sm: {
        fontSize: '$14',
        lineHeight: '$20',
      },
      xs: {
        fontSize: '$12',
        lineHeight: '$16',
      },
    },
    pill: {
      true: {
        borderRadius: '$800',
      },
    },
  },
});

export default Badge;
