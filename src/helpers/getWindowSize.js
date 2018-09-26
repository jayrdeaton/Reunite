let runCommand = require('./runCommand');

module.exports = (num) => {
  return new Promise((resolve, reject) => {
    if (!num) num = 1;
    runCommand(`osascript -e 'tell application "Terminal" \n get size of window ${num} \n end tell'`).then((data) => {
      data = data.replace('\n', '').split(', ');
      let result = [];
      for (let num of data) {
        result.push(parseInt(num));
      };
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
};
