export const retrieveNameFromArgs = () =>
  process.argv
    .slice(2)
    .map((arg) => arg.replace(/^--/, '').split('=')[1])
    .filter(Boolean)[0];
