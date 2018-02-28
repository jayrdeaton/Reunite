let runCommand = require('./runCommand');

module.exports = () => {
  return new Promise((resolve, reject) => {
    runCommand(
      `osascript -e 'tell application "Terminal"
        tell application "System Events" to keystroke "n" using {command down}
      end tell'`
    ).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
