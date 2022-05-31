import { dangerColors } from './danger.colors';
import { highlight1Colors } from './highlight1.colors';
import { highlight2Colors } from './highlight2.colors';
import { highlight3Colors } from './highlight3.colors';
import { highlight4Colors } from './highlight4.colors';
import { infoColors } from './info.colors';
import { primaryColors } from './primary.colors';
import { secondaryColors } from './secondary.colors';
import { successColors } from './success.colors';
import { warningColors } from './warning.colors';

const colors = {
	// background: "#F4F7F8",
	// rgba(244, 247, 248, 1)
	background: '#F4F7F8',
	surface: '#FFFFFF',
	transparent: '#FFFFFF 0%',
	black: '#000000',
	white: '#FFFFFF',

	...primaryColors,
	...secondaryColors,
	...highlight1Colors,
	...highlight2Colors,
	...highlight3Colors,
	...highlight4Colors,
	...dangerColors,
	...successColors,
	...warningColors,
	...infoColors
};

export { colors };
