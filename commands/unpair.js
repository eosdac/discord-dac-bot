const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{
    
    constructor(){
        super('unpair', 'Unpair the eos account from your Discord account. Executing this command will remove the Registered Member and Custodian roles from your account and will delete your entry in the database.');
        this.parameters = '<accountname>';
    }

    async execute(bot, member, message, args){

        if(args[0]){
            let discorduser = await bot.mongo.db.collection('disordbot').find({_id: message.author.id}).toArray();

            if(!discorduser.length) {
                message.author.send(`You're Discord account is not paired with an eos account. Can't execute the unpair command.`);
                return;
            }
            if(discorduser[0].eos_account !== args[0]) {
                message.author.send(`*${args[0]}* is not paired with your account. Run the command \`${bot.config.bot.prefix}unpair ${discorduser[0].eos_account}\` `);
                return;
            }

            let guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
            let role_rm = guild.roles.find(role => role.name === "Registered Member");
            let role_cust = guild.roles.find(role => role.name === "Custodian");

            await Promise.all([
                member.removeRole(role_rm).catch(e=>console.error(e) ), 
                member.removeRole(role_cust).catch(e=>console.error(e) ),
                bot.mongo.db.collection('disordbot').deleteOne({_id: message.author.id} )
            ]);
            
            message.author.send(`You unpaired your eos account and deleted your details. Your Discord roles are adapted accordingly.`);

        }
        else{
            message.author.send(`You need to add an accountname to the command \`${this.name} ${this.parameters}\`.`);
        }
    }
}

module.exports = cmd;