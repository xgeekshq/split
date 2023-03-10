/* eslint-disable react/no-unstable-nested-components */
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text';

const QueryError: React.FC = ({ children }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <Flex css={{ my: '$24' }} direction="column" gap="12">
            <Text color="dangerBase">There was an error fetching the data! </Text>
            <Button onClick={resetErrorBoundary}>Try again</Button>
          </Flex>
        )}
        onReset={reset}
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

export default QueryError;
