let runCommand = require('./runCommand');

module.exports = async (script) => {
  if (!script) script = '';
  return await runCommand(
    `osascript -e 'tell application "System Events" to tell application "Terminal"
      do script("${script}")
    end tell'`
  );

};
