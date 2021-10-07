import { useEffect } from "react";
import { useStoreContext } from "../store/store-context";
import CreateBoard from "../components/Dashboard/CreateBoardButton";

const Dashboard: React.FC = () => {
  const { dispatch } = useStoreContext();

  useEffect(() => {
    dispatch({ type: "setTitle", val: "Dashboard" });
  }, [dispatch]);

  return (
    <>
      <CreateBoard />
    </>
  );
};
export default Dashboard;
