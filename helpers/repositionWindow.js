let runCommand = require('./runCommand');

module.exports = (num, x, y, width, height) => {
  return new Promise((resolve, reject) => {
    if (!num || (!x && x !== 0) || (!y && y !== 0) || !width || !height) return reject(new Error('No window, x, y, width, or height'));
    runCommand(
      `osascript -e 'tell application "System Events" to tell application process "Terminal"
        try
          get properties of window ${num}
          set position of window ${num} to {${x}, ${y}}
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
