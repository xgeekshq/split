import React, { Fragment } from 'react';
import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { styled } from '@/styles/stitches/stitches.config';
import { BreadcrumbItemType, BreadcrumbType } from '@/types/board/Breadcrumb';

const StyledList = styled('ul', {
  display: 'flex',
  alignItems: 'center',
  gap: 5,

  margin: 0,
  padding: 0,

  listStyle: 'none',
});

const StyledBreadcrumbItem = styled('li', {
  fontSize: '$14',
  variants: {
    isActive: {
      true: {
        color: '$primary800',
      },
      false: {
        color: '$primary300',
      },
    },
  },

  a: {
    color: '$primary300',
    textDecoration: 'none',

    '&:hover': {
      color: '$primary800',
    },
  },
});

export type BreadcrumbProps = {
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
  <StyledList data-testid="breadcrumb">
    {items.map((item: BreadcrumbItemType, index) => (
      <Fragment key={item.title.toLowerCase().split(' ').join('-')}>
        {
          // If not the first item, show the chevron icon
          index !== 0 && <Icon css={{ color: '$primary300' }} name="arrow-right" size={16} />
        }
        <BreadcrumbItem item={item} />
      </Fragment>
    ))}
  </StyledList>
);

export default Breadcrumb;
