import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">This is the interior content of the robust Card component.</p>
      </CardContent>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
