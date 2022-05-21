type BreadcrumbItemType = {
	title: string;
	link?: string;
	isActive?: boolean;
};

type BreadcrumbType = BreadcrumbItemType[];

export { BreadcrumbItemType, BreadcrumbType };
