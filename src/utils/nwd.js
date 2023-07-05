import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

// Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
export const up = (currentDir) => {
  const parentDir = path.dirname(currentDir);
  if (currentDir === parentDir) {
    console.log('Already in the root folder.');
  } else {
    process.chdir(parentDir);
    return parentDir;
  }
};

// Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
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

/**
 * Print in console list of all files and folders in current directory. List should contain:
 * list should contain files and folder names (for files - with extension)
 * folders and files are sorted in alphabetical order ascending, but list of folders goes first
 * type of directory content should be marked explicitly (e.g. as a corresponding column value)
 */
export const ls = async (currentDir) => {
  try {
    if (await pathExists(currentDir)) {
      const files = await fsPromises.readdir(currentDir);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.resolve(currentDir, file);
          const stats = await fsPromises.stat(filePath);
          return {
            Name: file,
            Type: stats.isDirectory() ? 'directory' : 'file',
          };
        })
      );

      const directoriesOnly = fileStats
        .filter((file) => file.Type === 'directory')
        .sort((a, b) => a.Name.localeCompare(b.Name));
      const filesOnly = fileStats
        .filter((file) => file.Type === 'file')
        .sort((a, b) => a.Name.localeCompare(b.Name));

      console.table([...directoriesOnly, ...filesOnly]);
    } else {
      throw new Error('Folder does not exist');
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};
