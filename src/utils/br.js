import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { promises } from 'stream';
import path from 'path';

import { pathExists } from '../pathExists.js';

export const compress = async (currentDir, sourceFile, destinationPath) => {
  const filename = path.basename(sourceFile);
  const fileToCompress = path.resolve(currentDir, sourceFile);
  const compressedFile = path.resolve(
    currentDir,
    destinationPath ?? '',
    `${filename}.br`
  );

  try {
    if (!(await pathExists(fileToCompress))) {
      throw new Error('File does not exist or inaccessible');
    }

    if (await pathExists(compressedFile)) {
      throw new Error('File is already compressed');
    }

    // Create a readable stream from the source file
    const readStream = createReadStream(fileToCompress);

    // Create a writable stream for the compressed file
    const writeStream = createWriteStream(compressedFile);

    // Create a Brotli compression stream
    const compressionStream = createBrotliCompress();

    // Wait for the compression process to complete
    await promises.pipeline(readStream, compressionStream, writeStream);

    console.log(
      `File compressed successfully. Compressed file: ${compressedFile}`
    );
  } catch (error) {
    console.error(
      'Operation failed: An error occurred during file compression:',
      error
    );
  }
};

export const decompress = async (currentDir, sourceFile, destinationPath) => {
  const filename = path.basename(sourceFile);
  const fileToDecompress = path.resolve(currentDir, sourceFile);
  const decompressedFile = path.resolve(
    currentDir,
    destinationPath ?? '',
    `${filename.replace('.br', '')}`
  );

  try {
    if (!(await pathExists(fileToDecompress))) {
      throw new Error('File does not exist or inaccessible');
    }

    if (await pathExists(decompressedFile)) {
      throw new Error('File is already decompressed');
    }

    // Create a readable stream from the compressed file
    const readStream = createReadStream(fileToDecompress);

    // Create a writable stream for the decompressed file
    const writeStream = createWriteStream(decompressedFile);

    // Create a Brotli decompression stream
    const decompressionStream = createBrotliDecompress();

    // Wait for the decompression process to complete
    await promises.pipeline(readStream, decompressionStream, writeStream);

    console.log(
      `File decompressed successfully. Decompressed file: ${decompressedFile}`
    );
  } catch (error) {
    console.error(
      'Operation failed: n error occurred during file decompression:',
      error
    );
  }
};
