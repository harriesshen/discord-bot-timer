const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const monsters = require("../../monster.json");

module.exports = {
  // data: new SlashCommandBuilder()...
  data: new SlashCommandBuilder()
    .setName("monster")
    .setDescription("Set Monster Timer!"),
  async execute(interaction) {
    //建立按鈕(troll,outlaw)
    const monsterButtonArray = [];
    monsters.forEach((monster) => {
      const name = monster.name;
      monsterButtonArray.push(
        new ButtonBuilder()
          .setCustomId(name)
          .setLabel(name)
          .setStyle(ButtonStyle.Success)
      );
    });
    // 建立回應
    const row = new ActionRowBuilder().addComponents(monsterButtonArray);

    const reply = await interaction.reply({
      content: `Which monster did you kill?`,
      components: [row],
    });
    const collector = reply.createMessageComponentCollector();

    // 發送embed畫面訊息
    async function sendMessage(msg = "", done = false) {
      try {
        const embed = new EmbedBuilder().setColor("Blue").setDescription(msg);
        if (done) {
          await interaction.deleteReply(); // 刪除訊息
          console.log("delete reply");
          return;
        }
        await interaction
          .editReply({ embeds: [embed], ephemeral: false, components: [] })
          .catch((error) => {});
      } catch (error) {
        console.log("sendMessage Error", error);
      }
    }

    collector.on("collect", async (collect) => {
      monsters.forEach(async (monster) => {
        const { name: monsterName, resetTime: time } = monster;
        if (collect.customId === monsterName) {
          let currentTime = 0;
          let done = false;
          let monsterInterval = null;
          await sendMessage(
            `⏰ choice ${monsterName} delay ${time - currentTime} second`
          );

          monsterInterval = setInterval(async () => {
            try {
              currentTime++;
              if (done) return clearInterval(monsterInterval);
              if (currentTime >= time) {
                const user = collect.user.id;
                done = true;
                await sendMessage(null, done); //
                await interaction.followUp({
                  embeds: [],
                  ephemeral: true,
                  content: `Hey <@${user}> need to go hunter ${monsterName}`,
                }); // tag member
              } else {
                await sendMessage(
                  `⏰ choice ${monsterName} delay ${time - currentTime} second`
                );
              }
            } catch (error) {
              console.log("Interval Error", error);
            }
          }, 1000);
        }
      });
    });
  },
};
