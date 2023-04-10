import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Sprite from '@/components/icons/Sprite';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Card from '@/stories/components/Card';

export default {
  title: 'Primitives/Icons',
  component: Sprite,
  parameters: {
    layout: 'start',
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        component: dedent`List of Icons that can be used in the \`Icon\` Primitive.`,
      },
      source: {
        code: null,
      },
    },
  },
};

const Template: ComponentStory<typeof Sprite> = () => {
  const [icons, setIcons] = useState<string[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<string[]>(icons);

  const methods = useForm({
    defaultValues: {
      search: '',
    },
  });

  const handleOnChange = () => {
    const searchValue = methods.getValues('search');
    setFilteredIcons(icons.filter((icon) => icon.includes(searchValue)));
  };

  useEffect(() => {
    const iconSymbols = document.querySelectorAll('#iconSprite symbol');
    const iconIDs = [...iconSymbols].map((icon) => icon.getAttribute('id')!);
    setIcons(iconIDs);
    setFilteredIcons(iconIDs);
  }, []);

  return (
    <Flex direction="column">
      <FormProvider {...methods}>
        <form
          onChange={handleOnChange}
          style={{ margin: '0 2.5rem 2rem' }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input icon="search" iconPosition="left" id="search" placeholder="Search" type="text" />
        </form>
      </FormProvider>
      <Flex gap="16" justify="center" wrap="wrap">
        {filteredIcons.map((icon) => {
          const displayIcon = <Icon name={icon} size={32} />;

          return (
            <Card key={icon} display={displayIcon}>
              <Text>
                <Text fontWeight="bold">Name:</Text> {icon}
              </Text>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
