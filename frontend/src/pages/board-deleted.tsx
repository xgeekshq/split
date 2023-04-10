import { ReactElement } from 'react';

import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import Button from '@/components/Primitives/Inputs/Button/Button';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const BoardDeleted = () => (
  <Flex direction="column">
    <Text css={{ mt: '$24' }} display="1">
      404
    </Text>

    <Text css={{ mt: '$8' }} heading="2" fontWeight="medium">
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
