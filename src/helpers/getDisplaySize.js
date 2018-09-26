let runCommand = require('./runCommand');

module.exports = () => {
  return new Promise((resolve, reject) => {
    runCommand(`osascript -e 'tell application "Finder" \n get bounds of window of desktop \n end tell'`).then((data) => {
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
