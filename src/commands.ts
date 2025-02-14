import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/payloads/v10';

const CAT_CMD: APIApplicationCommandOption = {
  name: 'cat',
  description: 'Sends a random picture of a cat',
  type: 1,
  options: [
    {
      name: 'says',
      description: 'Apply text to the image',
      type: ApplicationCommandOptionType.String,
      required: false,
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
    {
      name: 'color',
      description: 'Text color (hex: #ffffff)',
      type: ApplicationCommandOptionType.String,
      min_length: 4,
      max_length: 7,
    },
    {
      name: 'background',
      description: 'Text background color (hex: #000000)',
      type: ApplicationCommandOptionType.String,
      min_length: 4,
      max_length: 7,
    },
  ],
};

const COMMANDS = [CAT_CMD];

export default COMMANDS;
