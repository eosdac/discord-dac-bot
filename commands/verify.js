const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{

    constructor(){
        super('verify', 'Verify if your discord account is properly linked with an eos account and check if you are a registered eosDAC member.');

    }

    async execute(bot, member, message, args){
        //check if discord id is in database
        let discorduser = await bot.db.collection('disordbot').find({_id: message.author.id}).toArray();
        
        if(!discorduser.length) {
            message.author.send(`Please run the command \`$pair <accountname>\` first.`);
            return;
        }
    
        let actions = await this.eos.getActions(discorduser[0].eos_account);

        let last = actions.find(a => { 
            return a.act.account === bot.config.dac.verification_contract; 
        });
    
        if(!last) {
            message.author.send(`I couldn't find your on chain verification message. Please run the command again or verify your token again ${bot.config.dac.memberclient}/test/${discorduser[0].token}`);
            return;
        }
    
        if(last.act.data.token === discorduser[0].token ){
            let guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
            let role = guild.roles.find(role => role.name === "Registered Member");
            member.addRole(role).catch(e=>console.error(e) );
            message.author.send(`I added the "Registered Member" role to your account ${message.author}`);
        }
        else{
            message.author.send(`Tokens don't match, verification failed. You need to verify your token ${bot.config.dac.memberclient}/test/${discorduser[0].token}`);
        }
    }
}

module.exports = cmd;