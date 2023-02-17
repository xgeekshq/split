import { CARD_TEXT_DEFAULT, CARD_TEXT_TO_IMPROVE_SPLIT_COLUMN } from '@/utils/constants';

export const defaultRegularColumns = [
  {
    title: 'Went well',
    color: '$highlight1Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_DEFAULT,
  },
  {
    title: 'To improve',
    color: '$highlight4Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_DEFAULT,
  },
  {
    title: 'Action points',
    color: '$highlight3Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_DEFAULT,
  },
];

export const defaultSplitColumns = [
  {
    title: 'Went well',
    color: '$highlight1Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_DEFAULT,
  },
  {
    title: 'To improve',
    color: '$highlight4Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_TO_IMPROVE_SPLIT_COLUMN,
  },
  {
    title: 'Action points',
    color: '$highlight3Light',
    cards: [],
    isDefaultText: true,
    cardText: CARD_TEXT_DEFAULT,
  },
];
