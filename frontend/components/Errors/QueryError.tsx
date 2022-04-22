/* eslint-disable react/no-unstable-nested-components */
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";

const QueryError: React.FC = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <Flex css={{ my: "$24" }} direction="column" gap="12">
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
};

export default QueryError;
