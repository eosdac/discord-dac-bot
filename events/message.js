module.exports = async (bot, message) => {
    if(message.author.bot) return;
    if(message.content.indexOf(bot.config.bot.prefix) !== 0) return;

    const guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
    const member = guild.members.get(message.author.id);

    const args = message.content.slice(bot.config.bot.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd_obj = bot.getCommand(command);

    if(cmd_obj){
        //todo: handle permissions here: if role then else
        console.log('req roles', cmd_obj.required_roles);
        if(cmd_obj.required_roles.length === 0 || member.roles.some(r=>cmd_obj.required_roles.includes(r.name)) ) {
            // member has one of the required roles or no required roles set in the command
            bot.client.user.setActivity(`working for @${message.author.username}`);
            await cmd_obj.execute(bot, member, message, args);
            setTimeout(()=>{bot.client.user.setActivity(`Serving ${bot.config.dac.name}`) }, 1000);
        } else {
            // has none of the roles
            message.author.send(`You do not have the required role to execute this command`);
        }


    }
    else{
        message.author.send(`The command **${command}** does not exist`);
    }
}