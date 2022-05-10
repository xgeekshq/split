import { StyledList } from "./styles";
import BreadcrumbItem from "../BreadcrumbItem";
import ChevronRightIcon from "../../icons/ChevronRight";
import { Fragment } from "react";

type Props = {
  items: {
    title: string;
    link?: string;
    isActive?: boolean;
  }[];
};

const BoardBreadcrumb = ({ items }: Props) => {
  return (
    <StyledList>
      {items.map((item, key) => (
        <Fragment key={item.title.toLowerCase().split(" ").join("-")}>
          {
            // If not the first item, show the chevron icon
            key != 0 && <ChevronRightIcon css={{ path: { fill: "$primary300" } }} />
          }
          <BreadcrumbItem item={item} />
        </Fragment>
      ))}
    </StyledList>
  );
};

export default BoardBreadcrumb;
