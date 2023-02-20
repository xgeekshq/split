import Link from 'next/link';
import React, { Fragment } from 'react';

import Icon from '@/components/Primitives/Icon';
import { BreadcrumbItemType, BreadcrumbType } from '@/types/board/Breadcrumb';
import { StyledList, StyledBreadcrumbItem } from './styles';

type BreadcrumbProps = {
  items: BreadcrumbType;
};

type BreadcrumbItemProps = {
  item: BreadcrumbItemType;
};

const BreadcrumbItem = ({ item: { link, title, isActive } }: BreadcrumbItemProps) => {
  const contentRender = link ? <Link href={link}>{title}</Link> : title;

  return <StyledBreadcrumbItem isActive={isActive}>{contentRender}</StyledBreadcrumbItem>;
};

const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <StyledList>
    {items.map((item: BreadcrumbItemType, index) => (
      <Fragment key={item.title.toLowerCase().split(' ').join('-')}>
        {
          // If not the first item, show the chevron icon
          index !== 0 && <Icon size={16} css={{ color: '$primary300' }} name="arrow-right" />
        }
        <BreadcrumbItem item={item} />
      </Fragment>
    ))}
  </StyledList>
);

export default Breadcrumb;
