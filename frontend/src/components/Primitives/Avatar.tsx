import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '@/styles/stitches/stitches.config';

import useAvatarColor from 'hooks/useAvatarColor';
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
  colors,
  fallbackText,
  css,
  isBoardPage,
  id,
  isDefaultColor,
}) => {
  const avatarColor = useAvatarColor(id, isDefaultColor);
  if (colors === undefined) colors = avatarColor;

  return (
    <AvatarRoot
      css={{
        size,
        backgroundColor: colors?.bg,
        border: colors?.border ? '1px solid $primary200' : undefined,
        ...css,
        filter: 'drop-shadow(0px 1px 4px rgba(18, 25, 34, 0.05))',
      }}
    >
      <AvatarImage src={src} />
      <AvatarFallback
        css={{
          fontSize: !isBoardPage ? '$12' : '$10',
          lineHeight: !isBoardPage ? '$16' : '$12',
          fontWeight: !isBoardPage ? '$medium' : '$regular',
          fontFamily: 'DM Sans',
          color: colors?.fontColor,
          '& span': '',
        }}
      >
        {fallbackText}
      </AvatarFallback>
    </AvatarRoot>
  );
};

export default Avatar;
