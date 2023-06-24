import { promises as fsPromises } from 'fs';
import path from 'path';

export const cd = async (destinationPath, virtualCurrentDirectory) => {
  try {
    const currentDir = virtualCurrentDirectory;
    const targetDir = path.resolve(currentDir, destinationPath);
    const dirExists = await fsPromises.stat(targetDir);
    if (dirExists && dirExists.isDirectory()) {
      console.log(`Current directory changed to: ${targetDir}`);
      return targetDir;
    } else {
      console.log(`Directory does not exist: ${destinationPath}`);
    }
  } catch (error) {
    console.error(`An error occurred while changing directory: ${error}`);
  }
};
