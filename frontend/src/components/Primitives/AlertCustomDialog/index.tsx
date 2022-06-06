import { ReactNode } from 'react';

import { CSSProps } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent
} from '../AlertDialog';
import Flex from '../Flex';
import Separator from '../Separator';
import {
	DialogButtons,
	DialogText,
	DialogTitleContainer,
	StyledAlertDialogDescription,
	StyledDialogTitle
} from './styles';

interface BoardAlertDialog {
	defaultOpen: boolean;
	text: ReactNode;
	cancelText: string;
	confirmText: string;
	handleConfirm: () => void;
	title: ReactNode;
	handleClose?: () => void;
	children?: ReactNode;
	css?: CSSProps;
	variant?: 'primary' | 'danger';
	addEllipsis?: boolean;
}

const AlertCustomDialog = ({
	defaultOpen,
	text,
	handleClose,
	handleConfirm,
	title,
	cancelText,
	confirmText,
	children,
	css,
	addEllipsis,
	variant = 'primary'
}: BoardAlertDialog) => {
	return (
		<AlertDialog defaultOpen={defaultOpen}>
			{children}
			<AlertDialogContent css={{ ...css }} handleClose={handleClose}>
				<DialogTitleContainer justify="between" align="center">
					<StyledDialogTitle heading="4">{title}</StyledDialogTitle>
					<AlertDialogCancel
						isIcon
						asChild
						css={{ '@hover': { '&:hover': { cursor: 'pointer' } } }}
						onClick={handleClose}
					>
						<Flex css={{ '& svg': { color: '$primary400' } }}>
							<Icon name="close" css={{ width: '$24', height: '$24' }} />
						</Flex>
					</AlertDialogCancel>
				</DialogTitleContainer>
				<Separator css={{ backgroundColor: '$primary100' }} />
				<DialogText ellipsis={addEllipsis} direction="column">
					<StyledAlertDialogDescription>{text}</StyledAlertDialogDescription>
				</DialogText>
				<DialogButtons justify="end" gap="24">
					<AlertDialogCancel variant="primaryOutline" onClick={handleClose}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction variant={variant || 'danger'} onClick={handleConfirm}>
						{confirmText}
					</AlertDialogAction>
				</DialogButtons>
			</AlertDialogContent>
		</AlertDialog>
	);
};

AlertCustomDialog.defaultProps = {
	handleClose: undefined,
	children: undefined,
	css: undefined,
	variant: 'primary',
	addEllipsis: false
};

export default AlertCustomDialog;
