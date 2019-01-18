

module.exports = async (bot, message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(bot.config.bot.prefix) !== 0) return;
  
    //gather some data

    const guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
    const member = guild.members.get(message.author.id);

    const args = message.content.slice(bot.config.bot.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd_obj = bot.getCommand(command);

    if(cmd_obj){
        cmd_obj.execute(bot, member, message, args)
    }
    else{
        message.author.send(`The command ${command} does not exist`);
    }
}