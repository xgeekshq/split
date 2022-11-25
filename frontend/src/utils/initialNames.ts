import { bubbleColors } from '@/styles/stitches/partials/colors/bubble.colors';

export const getRandomColor = () => {
  const keys = Object.keys(bubbleColors);
  const value = Math.floor(Math.random() * keys.length);
  return { bg: `$${keys[value]}`, fontColor: `$${bubbleColors[keys[value]]}` };
};
