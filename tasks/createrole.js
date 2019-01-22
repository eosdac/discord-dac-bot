const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot, taskname){

        super(taskname);
        this.bot = bot;
    }

    async execute(rolename, color='BLUE'){
        if(!rolename || !color){
            console.log('Rolename and color required!');
            return false;
        }
        let newrole = 'Registered Member';

        let guild = await this.bot.client.guilds.find(guild => guild.name === this.bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === newrole);
        if(role){
            console.log('The role ${newrole} already exist in the guild');
            return;
        }

        guild.createRole({
            name: newrole,
            color: color,
        })
        .then(role => {
            console.log(`Created new role with name ${role.name} and color ${role.color}`);
            return true;
        })
        .catch(e=>{
            console.error(e);
            return false;
        });
    }
}

module.exports = task;