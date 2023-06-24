import readline from 'readline';
import { retrieveNameFromArgs } from './cli/args.js';
import { ls } from './fs/ls.js';

const homeDirectory = process.env.HOME || process.env.USERPROFILE;
const username = retrieveNameFromArgs();

console.log(`Welcome to the File Manager, ${username}!`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput() {
  return new Promise((resolve) => {
    rl.question(`You are currently in ${homeDirectory}\n`, (answer) => {
      resolve(answer);
    });
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

      switch (userInput) {
        case '.exit':
          exitGracefully();
          return;
        case 'up':
          console.log('Going up one level...');
          // Perform logic for going up one level
          break;
        case 'cd':
          console.log('Changing directory...');
          // Perform logic for changing directory
          break;
        case 'ls':
          await ls(homeDirectory);
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
