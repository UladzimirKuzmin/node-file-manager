import { createReadStream } from 'fs';
import path from 'path';

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
