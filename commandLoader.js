const { readdirSync } = require("fs");

const loadCommands = (client, directory) => {
  const files = readdirSync(directory, {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isDirectory()) {
      // 如果讀取到資料夾
      loadCommands(client, `${directory}/${file.name}`); // 進入該資料夾繼續讀取
    } else if (file.name.endsWith(".js")) {
      // 如果是JavaScript檔案
      const cmd = require(`${directory}/${file.name}`); // 掛載指令程式碼檔案
      client.command.set(cmd.name, cmd); // 將指令存入前面建立的指令暫存區
    }
  }
};

module.exports = loadCommands;
