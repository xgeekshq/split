import React, { useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '../../stitches.config';
import isEmpty from '../../utils/isEmpty';
import Icon from '../icons/Icon';
import Flex from './Flex';
import Text from './Text';

const PlaceholderText = styled(Text, {
	color: '$primary300',
	position: 'absolute',
	pointerEvents: 'none',
	transformOrigin: '0 0',
	transition: 'all .2s ease-in-out',
	p: '$16',
	"&[data-iconposition='left']": {
		pl: '$57'
	},
	"&[data-iconposition='right']": {
		pl: '$17'
	}
});

const IconWrapper = styled(Flex, {
	position: 'absolute',
	top: '$16',
	left: 'none',
	right: 'none',
	cursor: 'default',
	"&[data-iconposition='left']": {
		left: '$16'
	},
	"&[data-iconposition='right']": {
		right: '$16'
	},
	"&[data-type='password']": {
		'&:hover': {
			cursor: 'pointer'
		}
	}
});

const HelperTextWrapper = styled(Flex, {
	'& svg': {
		flex: '0 0 16px',
		// transform: 'transformY(100%)',
		// mt: '0px',
		height: '$16 ',
		width: '$16 ',
		color: '$dangerBase'
	},
	'& *:not(svg)': { flex: '1 1 auto' }
});

const StyledInput = styled('input', {
	// Reset
	appearance: 'none',
	borderWidth: '0',
	boxSizing: 'border-box',
	margin: '0',
	outlineOffset: '0',
	padding: '0',
	fontFamily: '$body',
	WebkitTapHighlightColor: 'rgba(0,0,0,0)',
	backgroundColor: '$white',
	'&::before': {
		boxSizing: 'border-box'
	},
	'&::after': {
		boxSizing: 'border-box'
	},
	'&:-internal-autofill-selected': {
		backgroundColor: '$white'
	},

	'&:-webkit-autofill,&:-webkit-autofill:active,&:-webkit-autofill:focus': {
		'-webkit-box-shadow': '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest'
	},

	'&:-webkit-autofill::first-line': {
		color: '$dangerBase',
		fontFamily: '$body',
		fontSize: '$16'
	},

	':-internal-autofill-previewed': {
		fontFamily: '$body',
		fontSize: '$16'
	},

	// Custom

	display: 'flex',
	fontSize: '$16',
	px: '$16',
	boxShadow: '0',
	border: '1px solid $primary200',
	outline: 'none',
	width: '100%',
	borderRadius: '$4',
	lineHeight: '$20',
	height: '$56',
	pt: '$28',
	pb: '$8',
	'&::-webkit-input-placeholder': {
		fontSize: '22px !important',
		color: '$primary300'
	},
	'&:disabled': {
		backgroundColor: '$primary50'
	},
	variants: {
		variant: {
			default: {
				'&:focus': {
					borderColor: '$primary400',
					boxShadow: '0px 0px 0px 2px $colors$primaryLightest'
				},
				'&:-webkit-autofill': {
					'-webkit-box-shadow':
						'0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest'
				}
			},
			valid: {
				borderColor: '$success700',
				boxShadow: '0px 0px 0px 2px $colors$successLightest',
				'&:-webkit-autofill': {
					'-webkit-box-shadow':
						'0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest'
				}
			},
			error: {
				borderColor: '$danger700',
				boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
				'&:-webkit-autofill': {
					'-webkit-box-shadow':
						'0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$dangerLightest'
				}
			}
		}
	},
	color: '$primaryBase',
	'&::placeholder': {
		'&:disabled': {
			color: '$primaryBase'
		},
		color: '$primary300'
	},
	'&:not(:placeholder-shown) ~ label': {
		transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`
	},
	'&:-internal-autofill-selected ~ label': {
		transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`
	},
	'&:focus ~ label': {
		transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`
	},

	"&[data-iconposition='left']": {
		pl: '$56',
		'&:not(:placeholder-shown) ~ label': {
			transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`
		},
		'&:focus ~ label': {
			transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`
		}
	},

	"&[data-iconposition='right']": {
		pr: '$56'
	}
});

type StyledInpupProps = React.ComponentProps<typeof StyledInput>;

interface InputProps extends StyledInpupProps {
	id: string;
	state?: 'default' | 'error' | 'valid';
	type: 'text' | 'password' | 'email' | 'number';
	placeholder: string;
	icon?: 'eye' | 'eyeclosed';
	helperText?: string;
	iconPosition?: 'left' | 'right';
	forceState?: boolean;
	disabled?: boolean;
	clearErrorCode?: () => void;
	currentValue?: string;
	maxChars?: string;
}

const Input: React.FC<InputProps> = ({
	id,
	placeholder,
	state,
	icon,
	iconPosition,
	helperText,
	type,
	disabled,
	css,
	forceState,
	clearErrorCode,
	currentValue,
	maxChars
}) => {
	Input.defaultProps = {
		state: undefined,
		iconPosition: undefined,
		icon: undefined,
		helperText: '',
		disabled: false,
		clearErrorCode: undefined,
		currentValue: undefined,
		maxChars: undefined,
		forceState: false
	};
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [currentType, setType] = useState(type);

	const {
		register,
		getValues,
		clearErrors,
		formState: { errors, touchedFields }
	} = useFormContext();
	const { ref, ...rest } = register(id);

	const message = errors[id]?.message;
	const value = getValues()[id];
	const isValueEmpty = isEmpty(value);
	const autoState = useMemo(() => {
		// console.log('!message=', !message);
		if (message) return 'error';
		if (isValueEmpty) return 'default';
		if (!message && !isValueEmpty) return 'valid';
		return undefined;
	}, [message, isValueEmpty]);

	const currentState = useMemo(() => {
		if (disabled && !touchedFields[id]) return 'default';
		if (state && forceState && !touchedFields[id]) return state;
		return autoState;
	}, [autoState, disabled, forceState, id, state, touchedFields]);

	const isHelperEmpty = isEmpty(helperText) && isEmpty(message);

	const [isVisible, setIsVisible] = useState<boolean>(false);

	const handleVisibility = () => setIsVisible((prevState) => !prevState);

	const handleOnClickIcon = () => {
		handleVisibility();
		if (type === 'text') return;
		setType(currentType === 'password' ? 'text' : 'password');
	};

	return (
		<Flex
			direction="column"
			css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto', ...css }}
			onBlur={() => {
				if (isValueEmpty) {
					clearErrors(id);
				}
			}}
		>
			{!!icon && (
				<IconWrapper
					data-iconposition={iconPosition}
					data-type={type}
					onClick={handleOnClickIcon}
				>
					{icon === 'eye' && (
						<Icon
							name={isVisible ? 'eye' : 'eye-slash'}
							css={{
								width: '$24',
								height: '$24'
							}}
						/>
					)}
				</IconWrapper>
			)}
			<Flex>
				<StyledInput
					{...rest}
					ref={(e) => {
						ref(e);
						inputRef.current = e;
					}}
					id={id}
					placeholder=" "
					disabled={disabled}
					type={currentType}
					variant={currentState}
					data-state={currentState}
					autoComplete="off"
					onFocus={clearErrorCode}
					data-iconposition={iconPosition}
				/>
				<PlaceholderText as="label" htmlFor={id} data-iconposition={iconPosition}>
					{placeholder}
				</PlaceholderText>
			</Flex>
			<Flex justify={!isHelperEmpty ? 'between' : 'end'}>
				{!isHelperEmpty && (
					<HelperTextWrapper gap="4" css={{ mt: '$8' }}>
						{currentState === 'error' && (
							<Icon name="info" css={{ width: '$24', height: '$24' }} />
						)}
						<Text
							css={{
								color: currentState === 'error' ? '$dangerBase' : '$primary300'
							}}
							hint
						>
							{!isEmpty(helperText) ? helperText : message}
						</Text>
					</HelperTextWrapper>
				)}
				{!!currentValue && (
					<Text
						css={{
							color: currentState === 'error' ? '$dangerBase' : '$primary300',
							mt: '$8'
						}}
						hint
					>
						{currentValue.length}/{maxChars}
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

export default Input;
