import readline from 'readline';
import { retrieveNameFromArgs } from './cli/args.js';
import { up } from './fs/up.js';
import { ls } from './fs/ls.js';
import { cd } from './fs/cd.js';

let virtualCurrentDirectory = process.env.HOME || process.env.USERPROFILE;

const username = retrieveNameFromArgs();

console.log(`Welcome to the File Manager, ${username}!`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput() {
  return new Promise((resolve) => {
    rl.question(
      `You are currently in ${virtualCurrentDirectory}\n`,
      (answer) => {
        resolve(answer);
      }
    );
  });
}

function exitGracefully() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

async function run() {
  try {
    process.on('SIGINT', exitGracefully);

    while (true) {
      const userInput = await getUserInput();
      const command = userInput.split(' ')[0];

      switch (command) {
        case '.exit':
          exitGracefully();
          return;
        case 'up':
          virtualCurrentDirectory = up(virtualCurrentDirectory);
          break;
        case 'cd':
          virtualCurrentDirectory = await cd(
            userInput.split(' ')[1],
            virtualCurrentDirectory
          );
          break;
        case 'ls':
          await ls(virtualCurrentDirectory);
          break;
        default:
          console.log(`Unknown command: ${userInput}`);
          break;
      }
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    rl.close();
  }
}

run();
