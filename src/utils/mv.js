import path from 'path';

import { pathExists } from '../pathExists.js';
import { cp } from './cp.js';
import { rm } from './rm.js';

export const mv = async (currentDir, sourceFile, destinationPath) => {
  const filename = path.basename(sourceFile);
  const sourcePath = path.resolve(currentDir, sourceFile);
  const targetPath = path.resolve(currentDir, destinationPath ?? '', filename);

  try {
    if (!(await pathExists(sourcePath))) {
      throw new Error('File does not exist or inaccessible');
    }

    if (await pathExists(targetPath)) {
      throw new Error('File already exists');
    }

    await cp(currentDir, sourceFile, destinationPath);
    await rm(currentDir, sourceFile);
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
