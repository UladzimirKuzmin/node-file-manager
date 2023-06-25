import { EOL, cpus, homedir, userInfo } from 'os';

const operations = {
  eol: printEOL,
  cpus: printCPUS,
  homedir: printHomeDir,
  username: printUsername,
  architecture: printArchitecture,
};

function printEOL() {
  console.log(
    `The default End-Of-Line (EOL) for the system is: ${JSON.stringify(EOL)}`
  );
}

function printCPUS() {
  const cpuInfo = cpus();
  const numCPUs = cpuInfo.length;

  console.log(`Overall amount of CPUs: ${numCPUs}`);

  cpuInfo.forEach((cpu, index) => {
    const { model, speed } = cpu;
    const clockRate = (speed / 1000).toFixed(2); // Convert to GHz with 2 decimal places
    console.log(
      `CPU ${index + 1}: Model: ${model}, Clock Rate: ${clockRate} GHz`
    );
  });
}

function printHomeDir() {
  const homeDir = homedir();
  console.log(`Home Directory: ${homeDir}`);
}

function printUsername() {
  const username = userInfo().username;
  console.log(`Current System User Name: ${username}`);
}

function printArchitecture() {
  const architecture = process.arch;
  console.log(`Node.js Binary Architecture: ${architecture}`);
}

export const os = (_, flag) => {
  const f = flag.replace(/^--/, '');
  const operation = operations[f];

  !!operation
    ? operation()
    : console.error(
        'Operation failed: such os method does not exist or not supported yet'
      );
};
