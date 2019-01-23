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

        try{
            //get all discord members with custodian role
            let guild = await this.bot.client.guilds.find(guild => guild.name === this.bot.config.bot.guildname);
            let role = await guild.roles.find(role => role.name === "Custodian");

            if(!role){
                console.log('Custodian role not set yet. exit');
                return false;
            }

            //old custodian roles from discord
            let old_custodian_ids = (await guild.roles.get(role.id).members).map(c =>c.id);

            //get new custodians from chain
            let new_custodian_eos_names = (await this.bot.eos.getCustodians() ).map(c=> c.cust_name);
            let new_custodian_map = await this.bot.mongo.db.collection('disordbot').find({eos_account:{ $in: new_custodian_eos_names }} ).toArray();
            let new_custodian_ids = new_custodian_map.map(ncm => ncm._id);

            //remove custodian role when needed
            for (let i = 0; i < old_custodian_ids.length; i++){
                let m = await guild.members.get(old_custodian_ids[i]);

                if(new_custodian_ids.includes(old_custodian_ids[i]) ){
                    await m.send(`You've been reelected as a Custodian for the next period.`);
                }
                else{
                    await m.removeRole(role).catch(e=>console.error(e) );
                    await m.send(`A new period has started. You are not reelected for the next period. The Custodian role is removed from your account.`);
                }
            }

            // add custodian role when needed
            for (let i = 0; i < new_custodian_ids.length; i++){
                let m = await guild.members.get(new_custodian_ids[i]);

                if(!old_custodian_ids.includes(new_custodian_ids[i]) ){
                    await m.addRole(role).catch(e=>console.error(e) );
                    await m.send(`Congratulations you've been elected for the current period. You received the Custodian role.`);
                }
            }
            await this.bot.client.channels.get(this.bot.config.bot.channels.announcement).send('@everyone A new period has started.');
            return true;
        }
        catch(e){
            console.error(e);
            return false;
        }
    }
}

module.exports = task;