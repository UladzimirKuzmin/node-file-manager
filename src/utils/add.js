import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const add = async (currentDir, filename) => {
  const filePath = path.resolve(currentDir, filename);

  try {
    if (await pathExists(filePath)) {
      throw new Error('File already exists');
    }

    await fsPromises.writeFile(filePath, '');
    console.log('File created successfully!');
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
