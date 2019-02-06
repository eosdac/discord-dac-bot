module.exports = (bot) => {
    console.log(`Bot has started, with ${bot.client.users.size} users, in ${bot.client.channels.size} channels of ${bot.client.guilds.size} guilds.`); 
    bot.client.user.setActivity(`Serving ${bot.config.dac.name}`);
}