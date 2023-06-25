import { promises as fsPromises } from 'fs';
import path from 'path';
import crypto from 'crypto';

import { pathExists } from '../pathExists.js';

export const hash = async (currentDir, pathToFile) => {
  const filePath = path.join(currentDir, pathToFile);

  try {
    if (await pathExists(filePath)) {
      const data = await fsPromises.readFile(filePath);

      // Create a hash object with the "sha256" algorithm
      const hash = crypto.createHash('sha256');

      // Update the hash object with the file data
      hash.update(data);

      // Calculate the hash digest as a hexadecimal string
      const hashHex = hash.digest('hex');

      console.log('SHA256 hash:', hashHex);
    } else {
      throw new Error('File to read does not exist or inaccessible');
    }
  } catch (error) {
    console.error(`Operation failed: ${error.message}`);
  }
};
