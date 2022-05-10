import Link from "next/link";
import { StyledBreadcrumbItem } from "./styles";

type Props = {
  item: {
    title: string;
    link?: string;
    isActive?: boolean;
  };
};

const BreadcrumbItem = ({ item: { link, title, isActive } }: Props) => {
  const contentRender = link ? (
    <Link href={link}>
      <a>{title}</a>
    </Link>
  ) : (
    title
  );

  return <StyledBreadcrumbItem isActive={isActive}>{contentRender}</StyledBreadcrumbItem>;
};

export default BreadcrumbItem;
