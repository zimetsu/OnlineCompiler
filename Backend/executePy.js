const { exec } = require("child_process");
const path = require("path");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    const pythonPath = "python"; // Use "python" as the Python executable if it's in the system's PATH environment variable.
    const command = `${pythonPath} ${filepath}`;

    exec(command, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  executePy,
};
