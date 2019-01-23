const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot, taskname){
        //set ms to execute the task at specific interval.
        //when not set or set to zero. the task will not run automatically.
        var interval = 0;//ms
        super(taskname, interval);
        this.bot = bot;
    }

    async execute(){
        //get all discord members with custodian role
        let guild = await this.bot.client.guilds.find(guild => guild.name === this.bot.config.bot.guildname);
        let role = await guild.roles.find(role => role.name === "Custodian");

        if(!role){
            console.log('Custodian role not set yet. exit');
            return false;
        }

        let old_custodians = (await guild.roles.get(role.id).members).map(c =>c.id);
        console.log(`Got ${old_custodians.length} members with that role.`);

        //remove custodian roles
        for (let i = 0; i < old_custodians.length; i++){
            let m = await guild.members.get(old_custodians[i]);
            await m.removeRole(role).catch(e=>console.error(e) );
            await m.send(`A new period has started.`);
        }

        //get new custodians from chain
        let new_custodians = (await this.bot.eos.getCustodians() ).map(c=> c.cust_name);

        //map eos accountnames with discord userids
        
        let discord_cust = await this.bot.mongo.db.collection('disordbot').find({eos_account:{ $in: new_custodians }} ).toArray();

        // add custodian roles
        for (let i = 0; i < discord_cust.length; i++){
            let m = await guild.members.get(discord_cust[i]._id);
            await m.addRole(role).catch(e=>console.error(e) );
            await m.send(`You've been elected for the current period. You received the Custodian role.`)
        }

    }


}

module.exports = task;