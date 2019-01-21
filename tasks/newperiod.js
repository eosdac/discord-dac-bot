const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot){
        //set ms to execute the task at specific interval. 
        var interval = 0;//ms
        super(interval);

        this.bot = bot;

    }

    async execute(){
        //get all discord members with custodian role
        let guild = await this.bot.client.guilds.find(guild => guild.name === this.bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === "Registered Member");
        let old_custodians = guild.roles.get(role.id).members;
        console.log(`Got ${old_custodians.size} members with that role.`);
        // old_custodians.forEach(oc =>{
        //     oc.send('A new period has started.');
        // });

        //get new custodians from chain

        //map eos accountnames with discord userids

        //remove and add custodian role 
    }


}

module.exports = task;