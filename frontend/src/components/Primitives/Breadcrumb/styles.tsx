import { styled } from '@/styles/stitches/stitches.config';

const StyledList = styled('ul', {
  display: 'flex',
  alignItems: 'center',
  gap: 5,

  margin: 0,
  padding: 0,

  listStyle: 'none',
});

const StyledBreadcrumbItem = styled('li', {
  fontSize: '$14',
  variants: {
    isActive: {
      true: {
        color: '$primary800',
      },
      false: {
        color: '$primary300',
      },
    },
  },

  a: {
    color: '$primary300',
    textDecoration: 'none',

    '&:hover': {
      color: '$primary800',
    },
  },
});

export { StyledList, StyledBreadcrumbItem };
