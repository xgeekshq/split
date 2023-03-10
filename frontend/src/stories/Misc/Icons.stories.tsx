import React, { useEffect, useState } from 'react';
import { ComponentStory } from '@storybook/react';

import Sprite from '@/components/icons/Sprite';
import dedent from 'ts-dedent';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import Input from '@/components/Primitives/Inputs/Input/Input';
import { FormProvider, useForm } from 'react-hook-form';
import Card from '../components/Card';

export default {
  title: 'Misc/Icons',
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
          style={{ margin: '0 2.5rem 2rem' }}
          onChange={handleOnChange}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input id="search" type="text" placeholder="Search" icon="search" iconPosition="left" />
        </form>
      </FormProvider>
      <Flex wrap="wrap" gap="16" justify="center">
        {filteredIcons.map((icon) => {
          const displayIcon = <Icon name={icon} size={32} />;

          return (
            <Card display={displayIcon} key={icon}>
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
