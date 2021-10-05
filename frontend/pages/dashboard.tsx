import { useEffect, useContext } from "react";
import TitleContext from "../store/title-context";

const Dashboard: React.FC = () => {
  const titleCtx = useContext(TitleContext);

  useEffect(() => {
    titleCtx.setTitle("Dashboard");
  }, [titleCtx]);

  return <>Dashboard</>;
};

export default Dashboard;
