import { useEffect, useState } from "react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";

const Dashboard: React.FC = () => {
  const { dispatch } = useStoreContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  const handleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const handleError = (state: boolean) => {
    setIsError(state);
  };

  const loadingContent = <div>Loading....</div>;
  const errorContent = <div>Error</div>;

  const bodyContent = <CreateBoard setLoading={handleLoading} setError={handleError} />;

  const handleContent = () => {
    if (isLoading) {
      return loadingContent;
    }
    if (isError) {
      return errorContent;
    }
    return bodyContent;
  };

  return handleContent();
};
export default Dashboard;
