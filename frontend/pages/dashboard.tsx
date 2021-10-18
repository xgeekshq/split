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

  if (isLoading) return <div>Loading....</div>;
  if (isError) return <div>Error</div>;
  return <CreateBoard setFetchLoading={handleLoading} setFetchError={handleError} />;
};
export default Dashboard;
