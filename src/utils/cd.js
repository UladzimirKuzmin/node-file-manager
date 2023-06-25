import { promises as fsPromises } from 'fs';
import path from 'path';

export const cd = async (currentDir, destinationPath) => {
  try {
    const targetDir = path.resolve(currentDir, destinationPath);
    const dirExists = await fsPromises.stat(targetDir);
    if (dirExists && dirExists.isDirectory()) {
      console.log(`Current directory changed to: ${targetDir}`);
      return targetDir;
    } else {
      throw new Error(`Directory does not exist: ${destinationPath}`);
    }
  } catch (error) {
    console.error(`Operation failed while changing directory: ${error}`);
  }
};
