// CHECK: Create Base Button
// Export Button & IconButton
import { styled } from '@/styles/stitches/stitches.config';

const Button = styled('button', {
  fontFamily: '$body',
  borderRadius: '$12',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  outline: 'none',
  gap: '$8',
  '@hover': {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  '&:disabled': {
    '@hover': {
      '&:hover': {
        cursor: 'not-allowed',
      },
    },
    '&:active': {
      boxShadow: 'none',
    },
  },
  variants: {
    variant: {
      primary: {
        color: '$white',
        backgroundColor: '$primaryBase',
        '@hover': {
          '&:hover': {
            backgroundColor: '$primary600',
          },
        },
        '&:active': {
          backgroundColor: '$primary600',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.8)',
        },
        '&:disabled': {
          backgroundColor: '$primary200',
        },
      },
      primaryOutline: {
        color: '$primaryBase',
        backgroundColor: '$transparent',
        border: '2px solid $primaryBase',
        '@hover': {
          '&:hover': {
            color: 'white',
            borderColor: '$primary600',
            backgroundColor: '$primary600',
          },
        },
        '&:active': {
          color: 'white',
          backgroundColor: '$primary600',
          borderColor: '$primary600',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '&:disabled': {
          color: '$primary200',
          borderColor: '$primary200',
          backgroundColor: '$transparent',
        },
      },
      light: {
        color: '$primaryBase',
        backgroundColor: '$primary100',
        '@hover': {
          '&:hover': {
            backgroundColor: '$primary200',
          },
        },
        '&:active': {
          backgroundColor: '$primary200',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '&:disabled': {
          color: '$primary200',
          backgroundColor: '$primary50',
          opacity: 0.8,
        },
      },
      transparent: {
        py: '$12',
        gap: '0',
        backgroundColor: '$tansparent',
        '&:disabled': {
          backgroundColor: '$primary50',
          opacity: 0.8,
        },
      },
      transparentHover: {
        py: '$2',
        gap: '0',
        backgroundColor: '$tansparent',
        '@hover': {
          '&:hover': {
            backgroundColor: '$highlight2Base',
          },
        },
        '&:active': {
          backgroundColor: '$highlight2Base',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
        },

        '&:disabled': {
          opacity: 0,
        },
      },
      lightOutline: {
        color: '$primary300',
        backgroundColor: '$transparent',
        border: '2px solid $primary100',
        '@hover': {
          '&:hover': {
            color: '$primaryBase',
            borderColor: '$primary200',
            backgroundColor: '$primary200',
          },
        },
        '&:active': {
          color: '$primaryBase',
          backgroundColor: '$primary200',
          borderColor: '$primary200',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '&:disabled': {
          color: '$primary600',
          backgroundColor: '$transparent',
          borderColor: '$primary100',
          opacity: 0.3,
        },
      },
      danger: {
        color: '$white',
        backgroundColor: '$dangerBase',
        '@hover': {
          '&:hover': {
            backgroundColor: '$danger700',
          },
        },
        '&:active': {
          backgroundColor: '$danger700',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '&:disabled': {
          backgroundColor: '$danger400',
          opacity: 0.3,
        },
      },
      dangerOutline: {
        color: '$dangerBase',
        backgroundColor: '$transparent',
        border: '2px solid $dangerBase',
        '@hover': {
          '&:hover': {
            color: '$white',
            borderColor: '$danger700',
            backgroundColor: '$danger700',
          },
        },
        '&:active': {
          color: 'white',
          backgroundColor: '$danger700',
          borderColor: '$danger700',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '&:disabled': {
          color: '$danger500',
          backgroundColor: '$transparent',
          borderColor: '$danger500',
          opacity: 0.3,
        },
      },
      link: {
        color: '$primaryBase',
        backgroundColor: '$transparent',
        border: 'none',
        '@hover': {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '&:active': {
          textDecoration: 'underline',
        },
        '&:disabled': {
          color: '$primary200',
          backgroundColor: '$transparent',
          textDecoration: 'none',
        },
      },
    },
    textSize: {
      lg: {
        fontSize: '$18',
        lineHeight: '$24',
      },
      md: {
        fontSize: '$16',
        lineHeight: '$20',
      },
      sm: {
        fontSize: '$14',
        lineHeight: '$16',
      },
    },
    size: {
      lg: {
        height: '$56',
        fontWeight: '$medium',
        fontSize: '$18',
        lineHeight: '$24',
        px: '$24',
        py: '$16',
        '& svg': {
          height: '$24',
          width: '$24',
        },
        '& span': {
          height: '$24',
          width: '$24',
        },
      },
      md: {
        height: '$48',
        fontWeight: '$medium',
        fontSize: '$16',
        lineHeight: '$20',
        px: '$24',
        py: '$14',
        '& svg': {
          height: '$20',
          width: '$20',
        },
        '& span': {
          height: '$20',
          width: '$20',
        },
      },
      sm: {
        height: '$36',
        fontWeight: '$medium',
        fontSize: '$14',
        lineHeight: '$16',
        px: '$16',
        py: '$10',
        '& svg': {
          height: '$16',
          width: '$16',
        },
      },
      xs: {
        height: '$10',
        fontWeight: '$bold',
        fontSize: '$12',
        lineHeight: '$1',
        px: '$1',
        py: '$1',
        '& span': {
          height: '$10',
          width: '$10',
        },
      },
    },
    isIcon: {
      true: {
        padding: '0 !important',
        height: 'auto !important',
        color: '$primary800',
        backgroundColor: '$transparent !important',
        '@hover': {
          '&:hover': {
            backgroundColor: '$transparent',
          },
        },
        '&:active': {
          backgroundColor: '$transparent',
          boxShadow: 'none',
        },
        '&:disabled': {
          backgroundColor: '$transparent',
          border: 'none',
          '& svg': {
            color: '$primary200',
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      isIcon: 'true',
      size: 'lg',
      css: {
        '& svg': {
          height: '$40',
          width: '$40',
        },
      },
    },
    {
      size: 'md',
      isIcon: 'true',
      css: {
        '& svg': {
          height: '$24',
          width: '$24',
        },
      },
    },
    {
      isIcon: 'true',
      size: 'sm',
      css: {
        '& svg': {
          height: '$20',
          width: '$20',
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export default Button;
