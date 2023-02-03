import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '@/styles/stitches/stitches.config';

import useAvatarColor from '@/hooks/useAvatarColor';
import Flex from './Flex';

const AvatarRoot = styled(AvatarPrimitive.Root, Flex, {
  border: '1px solid $colors$white',
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

type AvatarType = {
  fallbackText: string;
  colors?: { bg: string; fontColor: string; border?: boolean };
  src?: string;
  size?: number;
  isBoardPage?: boolean;
  id?: string;
  isDefaultColor?: boolean;
};

type AvatarProps = AvatarType & React.ComponentProps<typeof AvatarRoot>;

const Avatar: React.FC<AvatarProps> = ({
  src,
  size,
  colors = undefined,
  fallbackText,
  css,
  isBoardPage,
  id,
  isDefaultColor,
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
