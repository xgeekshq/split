import { useEffect } from "react";
import { useStoreContext } from "../store/store";
import CreateBoard from "../components/Dashboard/CreateBoardModal";

const Dashboard: React.FC = () => {
  const { dispatch } = useStoreContext();

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  return <CreateBoard />;
};
export default Dashboard;
