import { ReactElement } from 'react';

import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import Button from '@/components/Primitives/Inputs/Button/Button';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const Custom404 = () => (
  <Flex direction="column">
    <Text css={{ mt: '$24' }} display="1">
      404
    </Text>

    <Text css={{ mt: '$8' }} heading="2" fontWeight="medium">
      Page Not Found
    </Text>
    <Text color="primary500" css={{ mt: '$24' }} size="md">
      The page you are looking for might have been removed or is temporarily unavailable
    </Text>
    <Flex>
      <Link href="/">
        <Button css={{ mt: '$24' }} size="md">
          Go to Home
        </Button>
      </Link>
    </Flex>
  </Flex>
);

Custom404.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default Custom404;
