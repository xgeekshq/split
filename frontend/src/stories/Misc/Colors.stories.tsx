import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';
import Sprite from '@/components/icons/Sprite';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { colors } from '@/styles/stitches/partials/colors';
import Card from '@/stories/components/Card';
import { capitalize } from '@/stories/utils';

const GROUPS = [
  'primary',
  'secondary',
  'highlight1',
  'highlight2',
  'highlight3',
  'highlight4',
  'danger',
  'success',
  'warning',
  'info',
  'background',
  'surface',
  'transparent',
  'black',
  'white',
];

export default {
  title: 'Misc/Colors',
  component: Sprite,
  parameters: {
    layout: 'start',
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        component: dedent`List of colors used throughout the SPLIT application.`,
      },
      source: {
        code: null,
      },
    },
  },
};

const Template: ComponentStory<any> = () => {
  const colorsArray = Object.entries(colors);
  const groupedColors: any = {};

  GROUPS.forEach((group) => {
    const filteredColors = colorsArray.filter((c) => c[0].startsWith(group));
    groupedColors[group] = filteredColors;
  });

  return (
    <Flex direction="column">
      {Object.entries(groupedColors).map(([groupKey, groupValues]: any) => (
        <>
          <Text heading="2" fontWeight="bold" css={{ mb: '$8' }}>
            {capitalize(groupKey)}
          </Text>
          <Flex wrap="wrap" gap="16" justify="start" css={{ mb: '$32' }}>
            {groupValues.map((color: any) => {
              const [colorKey, colorValue] = color;
              return (
                <Card key={colorKey} backgroundColor={colorValue}>
                  <Flex direction="column">
                    <Text>
                      <Text fontWeight="bold">Name:</Text> {colorKey}
                    </Text>
                    <Text>
                      <Text fontWeight="bold">Value:</Text> {colorValue}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        </>
      ))}
    </Flex>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
