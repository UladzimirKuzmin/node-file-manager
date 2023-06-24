import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const ls = async (folderPath) => {
  try {
    if (await pathExists(folderPath)) {
      const files = await fsPromises.readdir(folderPath);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stats = await fsPromises.stat(filePath);
          return {
            Name: file,
            Type: stats.isDirectory() ? 'directory' : 'file',
          };
        })
      );
      console.table(fileStats);
    } else {
      throw new Error('FS operation failed: Folder does not exist');
    }
  } catch (error) {
    throw error;
  }
};

// async function listFiles() {
//   const homeDirectory = process.env.HOME || process.env.USERPROFILE;
//   const files = await fs.promises.readdir(homeDirectory);
//   const fileStats = await Promise.all(files.map(async (file, index) => {
//     const filePath = path.join(homeDirectory, file);
//     const stats = await fs.promises.stat(filePath);
//     return {
//       Index: index + 1,
//       Name: file,
//       Type: stats.isDirectory() ? 'Directory' : 'File'
//     };
//   }));
//   return fileStats;
// }
