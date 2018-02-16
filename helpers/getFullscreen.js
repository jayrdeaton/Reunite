let runCommand = require('./runCommand');

module.exports = (script, newWindow) => {
  return new Promise((resolve, reject) => {
    runCommand(`
      osascript -e 'tell application "System Events" to tell process "Terminal"
        get value of attribute "AXFullScreen" of window 1
      end tell'`).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
