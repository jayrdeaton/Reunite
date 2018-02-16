let runCommand = require('./runCommand');

module.exports = (num) => {
  return new Promise((resolve, reject) => {
    if (!num) num = 1;
    runCommand(
      `osascript -e 'tell application "System Events" to tell application "Terminal"
        set frontmost of window ${num} to true
      end tell'`
    ).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
