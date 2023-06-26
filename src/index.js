import { promises as rlPromises } from 'readline';

import { retrieveNameFromArgs } from './cli/args.js';
import * as utilOperations from './utils/operations.js';

let virtualCurrentDir = process.env.HOME || process.env.USERPROFILE;

const username = retrieveNameFromArgs();
const operations = {
  '.exit': exitGracefully,
  ...utilOperations,
};

const rl = rlPromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserInput() {
  return await rl.question(`You are currently in ${virtualCurrentDir}\n`);
}

function parseUserInput(userInput) {
  const [operation, ...args] = userInput.trim().split(' ');
  return { operation, args };
}

function exitGracefully() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

async function run() {
  console.log(`Welcome to the File Manager, ${username}!`);

  try {
    rl.on('SIGINT', exitGracefully);

    while (true) {
      const userInput = await getUserInput();
      const { operation, args } = parseUserInput(userInput);

      const operationFn = operations[operation];

      if (operationFn) {
        const targetDir = await operationFn(...[virtualCurrentDir, ...args]);

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
