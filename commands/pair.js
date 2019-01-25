const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{
    
    constructor(){
        super('pair', 'Link an eos account with your discord account.');
        this.parameters = '<accountname>';
    }

    async execute(bot, member, message, args){

        if(args[0]){
            let account = await bot.eos.getAccount(args[0]);
            // console.log(account)
            if(account){
                let discorduser = await bot.mongo.db.collection('disordbot').find({_id: message.author.id}).toArray();
                let extra_msg ='';
                if(discorduser.length && discorduser[0].verified){
                    let guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
                    let role = guild.roles.find(role => role.name === "Registered Member");
                    await member.removeRole(role).catch(e=>console.error(e) );
                    extra_msg = `I removed the registered member role from your account. `;
                }

                let priv = await ecc.randomKey();
                let pub = ecc.privateToPublic(priv).substring(3);
    
                await bot.mongo.db.collection('disordbot').updateOne(
                    { _id: message.author.id }, 
                    {$set:{name: message.author.username, token: pub, eos_account:args[0], verified: false } }, 
                    { upsert: true } 
                );
    
                let pairlink = `${bot.config.dac.memberclient}${bot.config.dac.memberclient_verification_path}/${pub}`;
    
                message.author.send(`${extra_msg}Visit the link below to pair eos account "${args[0]}" with ${message.author} \n ${pairlink}`);
            }
            else{
                message.author.send(`${args[0]} is not a valid eos account.`);
            }
        }
        else{
            message.author.send(`You need to add an accountname to the command \`${this.name} ${this.parameters}\`.`);
        }
    }
}

module.exports = cmd;