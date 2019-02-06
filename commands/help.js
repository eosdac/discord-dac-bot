const {Base_Command} = require('../classes/abstract/Base_Command');

class help extends Base_Command{

    constructor(){
        super('help', 'Show help for all available commands.');
    }

    async execute(bot, member, message, args){

        let c = bot.getCommand(args[0]);

        let embed = new bot.embed().setColor('#00AE86');

        if(c) {
            embed.addField(`**${bot.config.bot.prefix+args[0]}**`, `${c.description} ${this.parseRequiredRoles(c.required_roles)}`);
        }
        else{
            //list help for all commands
            embed.setTitle(`__A list of all commands understood by the bot.__`)
            .setDescription(`${this.getMemberRoles(member)}`);
            
            bot.commands.forEach(c => {
                embed.addField(`**${bot.config.bot.prefix+c.name} ${c.parameters}**`, `${c.description} ${this.parseRequiredRoles(c.required_roles)}`);
            }); 
        }
        
        message.author.send(embed);
    }

    parseRequiredRoles(r){
        if(r.length){
            return `\n**Allowed Roles:** *${r.join(', ')}*\n \u200b`
        }
        else{
            return '\n \u200b';
        }
    }

    getMemberRoles(member){
        let roles = member.roles.map(role=>role.name).filter(role=> role.charAt(0)!=='@');
        if(roles.length){
            return `You have the following assigned roles: ${roles.join(', ')}`;
        }
        else{
            return ' ';
        }
    }
}

module.exports = help;