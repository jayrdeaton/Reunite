let runCommand = require('./runCommand');

module.exports = () => {
  return new Promise((resolve, reject) => {
    runCommand(
      `osascript -e 'tell application "System Events" to tell process "Dock"
        get size in list 1
      end tell'`
      ).then((data) => {
      data = data.replace('\n', '').split(', ');
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
