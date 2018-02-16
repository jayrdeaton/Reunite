let runCommand = require('./runCommand');

module.exports = (script, newWindow) => {
  return new Promise((resolve, reject) => {
    runCommand(`
      osascript -e 'tell application "System Events" to tell process "Terminal"
        set value of attribute "AXFullScreen" of window 1 to false
        delay .5
      end tell'`).then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    });
  });
};
