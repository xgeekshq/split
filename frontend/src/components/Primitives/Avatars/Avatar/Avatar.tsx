import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '@/styles/stitches/stitches.config';

import useAvatarColor from '@/hooks/useAvatarColor';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  border: '1px solid $white',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  textAlign: 'center',
});

const AvatarImage = styled(AvatarPrimitive.Image, {
  size: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const AvatarFallback = styled(AvatarPrimitive.Fallback, {
  textAlign: 'center',
  fontFamily: 'DM Sans',
  '& span': '',
  variants: {
    isBoardPage: {
      true: {
        fontSize: '$10',
        lineHeight: '$12',
        fontWeight: '$regular',
      },
      false: {
        fontSize: '$12',
        lineHeight: '$16',
        fontWeight: '$medium',
      },
    },
  },
});

export const AvatarButton = styled('button', {
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  variants: {
    isClickable: {
      true: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      false: {
        '&:hover': {
          cursor: 'default',
        },
      },
    },
  },
});

export type AvatarColor = { bg: string; fontColor: string; border?: boolean };

type AvatarType = {
  fallbackText: string;
  colors?: AvatarColor;
  src?: string;
  size?: number;
  isClickable?: boolean;
  id?: string;
  isDefaultColor?: boolean;
  isBoardPage?: boolean;
};

type AvatarProps = AvatarType & React.ComponentProps<typeof AvatarRoot>;

const Avatar: React.FC<AvatarProps> = ({
  src,
  size,
  colors = undefined,
  fallbackText,
  css,
  id,
  isDefaultColor,
  isBoardPage = false,
}) => {
  const avatarColor = useAvatarColor(id, isDefaultColor);
  if (colors === undefined) colors = avatarColor;
  if (fallbackText.includes('undefined')) {
    fallbackText = '--';
  }
  return (
    <AvatarRoot
      css={{
        size,
        backgroundColor: colors?.bg,
        border: colors?.border ? '1px solid $primary200' : undefined,
        filter: 'drop-shadow(0px 1px 4px rgba(18, 25, 34, 0.05))',
        ...css,
      }}
    >
      <AvatarImage src={src} />
      <AvatarFallback
        isBoardPage={isBoardPage}
        css={{
          color: colors?.fontColor,
        }}
      >
        {fallbackText}
      </AvatarFallback>
    </AvatarRoot>
  );
};

export default Avatar;
