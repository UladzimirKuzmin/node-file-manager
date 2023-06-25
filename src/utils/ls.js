import { promises as fsPromises } from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

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
