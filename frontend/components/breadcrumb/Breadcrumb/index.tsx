import { StyledList } from "./styles";
import BreadcrumbItem from "../BreadcrumbItem";
import { Fragment } from "react";
import ChevronRightIcon from "../../icons/ChevronRight";
import { BreadcrumbItemType, BreadcrumbType } from "../../../types/board/Breadcrumb";

type Props = {
  items: BreadcrumbType;
};

const Breadcrumb = ({ items }: Props) => {
  return (
    <StyledList>
      {items.map((item: BreadcrumbItemType, key) => (
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

export default Breadcrumb;
