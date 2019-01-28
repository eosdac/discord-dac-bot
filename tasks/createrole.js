const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot, taskname){

        super(taskname);
        this.bot = bot;
    }

    async execute(rolename, color='#9BB9EE'){
        if(!rolename || !color){
            console.log('Rolename and/or color required!');
            return false;
        }
        let newrole = rolename;

        let guild = await this.bot.client.guilds.find(guild => guild.name === this.bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === newrole);
        
        if(role){
  
            if(role.hexColor.toLowerCase() !== color.toLowerCase()){
                let oldc = role.hexColor.toLowerCase();
                await role.edit({color: color}).catch(e => {
                    console.log(e);
                });
                return `color changed from ${oldc} to ${color.toLowerCase()}`;
            }
            else{
                return 'already exists';
            }
            
        }

        return guild.createRole({
            name: newrole,
            color: color,
        })
        .then(role => {
            console.log(`Created new role with name ${role.name} and color ${role.color}`);
            return 'created';
        })
        .catch(e=>{
            console.error(e);
            return 'error';
        });
    }
}

module.exports = task;