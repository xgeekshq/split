import { ReactNode } from 'react';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import { Switch, SwitchThumb } from 'components/Primitives/Switch';
import Text from 'components/Primitives/Text';

type Props = {
	title: string;
	text: string;
	isChecked: boolean;
	handleCheckedChange: (checked: boolean) => void;
	children?: ReactNode;
};

const ConfigurationSettings = ({
	title,
	text,
	isChecked,
	handleCheckedChange,
	children
}: Props) => (
	<Flex gap={20}>
		<Switch checked={isChecked} variant="sm" onCheckedChange={handleCheckedChange}>
			<SwitchThumb variant="sm">
				{isChecked && (
					<Icon
						name="check"
						css={{
							width: '$10',
							height: '$10',
							color: '$successBase'
						}}
					/>
				)}
			</SwitchThumb>
		</Switch>
		<Flex direction="column">
			<Text size="md" weight="medium">
				{title}
			</Text>
			<Text color="primary500" size="sm">
				{text}
			</Text>
			{children}
		</Flex>
	</Flex>
);

export { ConfigurationSettings };
