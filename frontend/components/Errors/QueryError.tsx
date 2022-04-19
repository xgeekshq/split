/* eslint-disable react/no-unstable-nested-components */
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";

const QueryError: React.FC = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <Flex css={{ my: "$24" }}>
              There was an error!
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
