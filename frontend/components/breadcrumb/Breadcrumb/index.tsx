import React, { Fragment } from 'react';

import { BreadcrumbItemType, BreadcrumbType } from '../../../types/board/Breadcrumb';
import Icon from '../../icons/Icon';
import BreadcrumbItem from '../BreadcrumbItem';
import { StyledList } from './styles';

type Props = {
	items: BreadcrumbType;
};

const Breadcrumb = ({ items }: Props) => {
	return (
		<StyledList>
			{items.map((item: BreadcrumbItemType, key) => (
				<Fragment key={item.title.toLowerCase().split(' ').join('-')}>
					{
						// If not the first item, show the chevron icon
						key !== 0 && (
							<Icon
								name="arrow-right"
								css={{ color: '$primary300', width: '$14', height: '$14' }}
							/>
						)
					}
					<BreadcrumbItem item={item} />
				</Fragment>
			))}
		</StyledList>
	);
};

export default Breadcrumb;
