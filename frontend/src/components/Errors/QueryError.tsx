/* eslint-disable react/no-unstable-nested-components */
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { ChildrenProp } from '@/types/common';

const QueryError = ({ children }: ChildrenProp) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Flex css={{ my: '$24' }} direction="column" gap="12">
            <Text color="dangerBase">There was an error fetching the data! </Text>
            <Button onClick={resetErrorBoundary}>Try again</Button>
          </Flex>
        )}
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

export default QueryError;
