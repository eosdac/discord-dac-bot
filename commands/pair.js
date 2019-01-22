const {Base_Command} = require('../classes/abstract/Base_Command');
///////
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{
    
    constructor(){
        super('pair', 'Link an eos account with your discord account.');
        this.parameters = '<accountname>';
    }

    async execute(bot, member, message, args){
        if(args[0]){
            let account = await bot.getAccount(args[0]);
            if(account){
                let priv = await ecc.randomKey();
                let pub = ecc.privateToPublic(priv).substring(3);
    
                await bot.db.collection('disordbot').updateOne(
                    { _id: message.author.id }, 
                    {$set:{name: message.author.username, token: pub, eos_account:args[0] } }, 
                    { upsert: true } 
                );
    
                let pairlink = `${bot.config.dac.memberclient}/test/${pub}`;
    
                message.author.send(`Visit the link below to pair eos account "${args[0]}" with ${message.author} \n ${pairlink}`);
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