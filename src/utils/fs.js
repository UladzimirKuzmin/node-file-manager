import {
  createReadStream,
  createWriteStream,
  promises as fsPromises,
} from 'fs';
import path from 'path';

import { pathExists } from '../pathExists.js';

// Read file and print it's content in console (should be done using Readable stream)
export const cat = async (currentDir, destinationPath) => {
  const pathToFile = path.resolve(currentDir, destinationPath);

  try {
    const stream = createReadStream(pathToFile, { encoding: 'utf8' });

    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }

    process.stdout.write('\n');
  } catch (err) {
    console.error('Operation failed: Unable to read the file:', err.message);
  }
};

// Create empty file in current working directory
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

// Rename file (content should remain unchanged)
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

// Copy file (should be done using Readable and Writable streams)
export const cp = async (currentDir, sourceFile, destinationPath) => {
  const filename = path.basename(sourceFile);
  const sourcePath = path.resolve(currentDir, sourceFile);
  const targetPath = path.resolve(currentDir, destinationPath ?? '', filename);

  try {
    if (!(await pathExists(sourcePath))) {
      throw new Error('File does not exist');
    }

    if (await pathExists(targetPath)) {
      throw new Error('File already exists');
    }

    const readable = createReadStream(sourcePath);
    const writable = createWriteStream(targetPath);

    return new Promise((resolve, reject) => {
      readable.on('error', (error) => reject(error));
      writable.on('error', (error) => reject(error));
      writable.on('finish', () => resolve());

      readable.pipe(writable);
    });
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};

// Delete file
export const rm = async (currentDir, sourceFile) => {
  const fileToRemove = path.resolve(currentDir, sourceFile);

  try {
    if (await pathExists(fileToRemove)) {
      await fsPromises.unlink(fileToRemove);
      console.log('File removed successfully!');
    } else {
      throw new Error('File to remove does not exist or inaccessible');
    }
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
};

// Move file (same as copy but initial file is deleted, copying part should be done using Readable and Writable streams)
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
