

module.exports = async (bot, message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(bot.config.bot.prefix) !== 0) return;

    const guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
    const member = guild.members.get(message.author.id);

    const args = message.content.slice(bot.config.bot.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd_obj = bot.getCommand(command);

    if(cmd_obj){
        bot.client.user.setActivity(`working for @${message.author.username}`);
        cmd_obj.execute(bot, member, message, args);
        setTimeout(()=>{bot.client.user.setActivity(`Serving ${bot.config.dac.name}`) }, 1000)
        ;
    }
    else{
        message.author.send(`The command ${command} does not exist`);
    }
}