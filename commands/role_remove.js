const {Base_Command} = require('../classes/abstract/Base_Command');

class cmd extends Base_Command{

    constructor(){
        super('role_remove', `This command will remove <role name> from your account.`);
        this.disable = false;
        this.parameters=['<role name>'];
        this.required_roles = ['Registered Member'];
    }

    async execute(bot, member, message, args){
        let rolename = args.map(a => a.charAt(0).toUpperCase() + a.substring(1)).join(' ');

        let guild = await bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === rolename);
        
        if(!role){
            message.author.send(`The role "${rolename}" doesn't exist in the guild.`);
            return;
        }

        if(bot.config.dac.roles.priv.map(pr=>pr.name).includes(rolename) ){
            message.author.send(`You can not remove the "${rolename}" role from your account.`);
            return;  
        }

        if(!member.roles.has(role.id) ){
            message.author.send(`Can't remove the role from your account because you don't have the "${rolename}" role.`);
            return;
        }

        await member.removeRole(role).catch(e=>console.error(e) );
        await message.author.send(`I have removed the "${rolename}" role from your account.`);
    }
}

module.exports = cmd;