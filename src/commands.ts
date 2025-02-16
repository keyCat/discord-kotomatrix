import { ApplicationCommandOptionType } from 'discord-api-types/payloads/v10';

const CAT_CMD_TEXT_OPTIONS = [
  {
    name: 'text',
    description: 'Text to add',
    type: ApplicationCommandOptionType.String,
    min_length: 1,
    max_length: 2048,
  },
  {
    name: 'size',
    description: 'Font size',
    type: ApplicationCommandOptionType.Integer,
    min_value: 6,
    max_value: 128,
  },
  {
    name: 'color',
    description: 'Text color (color: "red" or hex: "#ffffff")',
    type: ApplicationCommandOptionType.String,
    min_length: 3,
  },
  {
    name: 'background',
    description: 'Text background color (color: "blue" or hex: #000000)',
    type: ApplicationCommandOptionType.String,
    min_length: 3,
  },
  {
    name: 'font',
    description: 'Font face',
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: 'Impact', value: 'Impact' },
      { name: 'Arial', value: 'Arial' },
      { name: 'Arial Black', value: 'Arial Black' },
      { name: 'Comic Sans MS', value: 'Comic Sans MS' },
      { name: 'Courier New', value: 'Courier New' },
      { name: 'Georgia', value: 'Georgia' },
      { name: 'Times New Roman', value: 'Times New Roman' },
      { name: 'Verdana', value: 'Verdana' },
      { name: 'Andale Mono', value: 'Andale Mono' },
    ],
  },
];

const CAT_CMD: any = {
  name: 'cat',
  description: 'Post a random picture of a cat',
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: 'pic',
      description: 'Post a random picture of a cat',
      type: ApplicationCommandOptionType.Subcommand,
      options: [...CAT_CMD_TEXT_OPTIONS],
    },
    {
      name: 'gif',
      description: 'Post a random cat gif',
      type: ApplicationCommandOptionType.Subcommand,
      options: [...CAT_CMD_TEXT_OPTIONS],
    },
  ],
};

const COMMANDS = [CAT_CMD];

export default COMMANDS;
