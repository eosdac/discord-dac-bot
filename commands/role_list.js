const {Base_Command} = require('../classes/abstract/Base_Command');

class cmd extends Base_Command{

    constructor(){
        super('role_list', `List all roles that can be self assigned.`);
        this.disable = false;

    }

    async execute(bot, member, message, args){
        let rolename = args.map(a => a.charAt(0).toUpperCase() + a.substring(1)).join(' ');

        let guild = await bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === rolename);

        let embed = new bot.embed().setColor('#00AE86');
        embed.setTitle(`__Roles that can be self assined.__`)
        .setDescription(`These roles can be self assigned`);
        
        bot.config.dac.roles.pub.forEach(c => {
            embed.addField(`**${c.name}**`, `${c.description}`);
        }); 

        await message.author.send(embed);
    }
}

module.exports = cmd;