let runCommand = require('./runCommand');

module.exports = (x, y, width, height) => {
  y = parseInt(y) + 34;
  return new Promise((resolve, reject) => {
    runCommand(
      `osascript -e 'tell application "System Events" to tell application "Terminal"
        tell application "System Events" to keystroke "n" using {command down}
      end tell'`
    ).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
