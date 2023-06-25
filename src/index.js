import { promises as rlPromises } from 'readline';

import { retrieveNameFromArgs } from './cli/args.js';
import * as utilCommands from './utils/commands.js';

let virtualCurrentDir = process.env.HOME || process.env.USERPROFILE;

const username = retrieveNameFromArgs();
const commands = {
  '.exit': exitGracefully,
  ...utilCommands,
};

const rl = rlPromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserInput() {
  return await rl.question(`You are currently in ${virtualCurrentDir}\n`);
}

function parseUserInput(userInput) {
  const [command, ...args] = userInput.trim().split(' ');
  return { command, args };
}

function exitGracefully() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

async function run() {
  console.log(`Welcome to the File Manager, ${username}!`);

  try {
    process.on('SIGINT', exitGracefully);

    while (true) {
      const userInput = await getUserInput();
      const { command, args } = parseUserInput(userInput);

      const commandFn = commands[command];

      if (commandFn) {
        const targetDir = await commandFn(...[virtualCurrentDir, ...args]);

        if (targetDir) {
          virtualCurrentDir = targetDir;
        }
      } else {
        console.log(`Invalid input: ${userInput}`);
      }
    }
  } catch (error) {
    console.error(`Operation failed: ${error}`);
  } finally {
    rl.close();
  }
}

run();
