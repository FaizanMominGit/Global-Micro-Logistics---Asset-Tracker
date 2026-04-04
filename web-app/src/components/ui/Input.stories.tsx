import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search tracking IDs...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Read-only value',
  },
};
