import { ReactElement } from 'react';
import Link from 'next/link';

import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

const BoardDeleted = () => (
  <Flex direction="column">
    <Text css={{ mt: '$24' }} display="1">
      404
    </Text>

    <Text css={{ mt: '$8' }} fontWeight="medium" heading="2">
      Board deleted
    </Text>
    <Text color="primary500" css={{ mt: '$24' }} size="md">
      The board was deleted by a board admin
    </Text>
    <Flex>
      <Link href="/dashboard">
        <Button css={{ mt: '$24' }} size="md">
          Go to Dashboard
        </Button>
      </Link>
    </Flex>
  </Flex>
);

BoardDeleted.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default BoardDeleted;
