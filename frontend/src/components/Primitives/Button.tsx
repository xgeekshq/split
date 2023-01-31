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
    isIcon: {
      true: {
        padding: '0 !important',
        width: 'auto !important',
        height: 'auto !important',
        color: '$primary800 !important',
        backgroundColor: '$transparent !important',
        '@hover': {
          '&:hover': {
            backgroundColor: '$transparent !important',
          },
        },
        '&:active': {
          backgroundColor: '$transparent !important',
          boxShadow: 'none',
        },
        '&:disabled': {
          backgroundColor: '$transparent !important',
          border: 'none',
          '& svg': {
            color: '$primary200 !important',
          },
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
          height: '$24 !important',
          width: '$24 !important',
        },
        '& span': {
          height: '$24 !important',
          width: '$24 !important',
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
          height: '$20 !important',
          width: '$20 !important',
        },
        '& span': {
          height: '$20 !important',
          width: '$20 !important',
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
          height: '$16 !important',
          width: '$16 !important',
        },
      },
    },
  },
  compoundVariants: [
    {
      size: 'lg',
      isIcon: 'true',
      css: {
        '& svg': {
          height: '$40 !important',
          width: '$40 !important',
        },
      },
    },
    {
      size: 'md',
      isIcon: 'true',
      css: {
        '& svg': {
          height: '$24 !important',
          width: '$24 !important',
        },
      },
    },
    {
      size: 'sm',
      isIcon: 'true',
      css: {
        '& svg': {
          height: '$20 !important',
          width: '$20 !important',
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
