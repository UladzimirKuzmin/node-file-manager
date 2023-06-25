import path from 'path';

export const up = (currentDir) => {
  const parentDir = path.dirname(currentDir);
  if (currentDir === parentDir) {
    console.log('Already in the root folder.');
  } else {
    process.chdir(parentDir);
    return parentDir;
  }
};
