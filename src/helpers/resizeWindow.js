let runCommand = require('./runCommand');

module.exports = (num, width, height) => {
  return new Promise((resolve, reject) => {
    if (!num || !width || !height) return reject(new Error('No window, width, or height'));
    runCommand(
      `osascript -e 'tell application "System Events" to tell application process "Terminal"
        try
          get properties of window ${num}
          set size of window ${num} to {${width}, ${height}}
        end try
      end tell'`
    ).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
