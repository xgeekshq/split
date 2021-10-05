import { useEffect, useContext } from "react";
import TitleContext from "../store/title-context";
import CreateBoard from "../components/Dashboard/CreateBoardButton";

const Dashboard: React.FC = () => {
  const titleCtx = useContext(TitleContext);

  useEffect(() => {
    titleCtx.setTitle("Dashboard");
  }, [titleCtx]);

  return (
    <>
      <CreateBoard />
    </>
  );
};
export default Dashboard;
