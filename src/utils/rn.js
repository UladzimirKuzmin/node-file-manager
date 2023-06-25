import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const rn = async (currentDir, pathToFile, newFileName) => {
  const sourceFile = path.resolve(currentDir, pathToFile);
  const destinationFile = path.resolve(currentDir, newFileName);

  try {
    if (await pathExists(destinationFile)) {
      throw new Error('Destination file already exists');
    }

    if (await pathExists(sourceFile)) {
      await fsPromises.rename(sourceFile, destinationFile);
      console.log('File renamed successfully!');
    } else {
      throw new Error('Source file does not exist or inaccessible');
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
