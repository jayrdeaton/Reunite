let runCommand = require('./runCommand');

module.exports = () => {
  return new Promise((resolve, reject) => {
    runCommand(
      `osascript -e 'tell application "System Events" to tell application "Terminal"
        count of windows
      end tell'`
    ).then((data) => {
      data = data.replace('\n', '');
      data = parseInt(data);
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
