const { exec } = require('child_process');
const fs = require('fs');

const sleepTime = 2000;

let triesCount = 0;

const sleep = async ms => {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const startProductionEnv = async () => {
  if (triesCount >= 10) return;
  triesCount++;

  if (!fs.existsSync('../node_modules')) {
    await new Promise(resolve => {
      exec('npm ci', (_, stdout) => {
        console.log(stdout);

        resolve();
      });
    });
  }

  exec('npm run codegen', async (err, stdout, stderr) => {
    console.log(stdout);

    if (err) {
      console.log('Failed to run codegen');
      console.error(err);
      console.log('This might be because the backend server hasnt started yet');
      console.log(`Sleeping ${sleepTime} ms before trying again`);
      await sleep(sleepTime);

      startProductionEnv();

      return;
    }

    if (stderr && !stderr.includes('experimental feature')) {
      console.log(
        "Couldn't find the needed module, testing installing dependencies",
      );

      exec('npm ci', (err, stdout, stderr) => {
        console.log(stdout);
        if (stdout) {
          console.log('Successfully installed dependencies');

          startProductionEnv();

          return;
        }

        console.log('Failed to installed dependencies');
      });
    }
  });
};

startProductionEnv();
