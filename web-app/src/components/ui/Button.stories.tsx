import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Primary Action',
    variant: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: 'Secondary Action',
    variant: 'outline',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete Asset',
    variant: 'destructive',
  },
};
