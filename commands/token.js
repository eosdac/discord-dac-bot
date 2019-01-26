const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{

    constructor(){
        super('token', `Display the tokenmetrics of EOSDAC as well as your balance.`);
        this.required_roles = ['Registered Member'];

    }

    async execute(bot, member, message, args){
        //check if discord id is in database
        let discorduser = await bot.mongo.db.collection('disordbot').find({_id: message.author.id, verified:true}).toArray();

        let [stats, balance] = await Promise.all([
            bot.eos.getTokenStats(),
            bot.eos.getBalance(bot.config.dac.token.contract, discorduser[0].eos_account, bot.config.dac.token.symbol)
        ])

        if(stats){
          let embed = new bot.embed()
          .setColor('#00AE86')
          .setTitle(`Token Statistics for ${bot.config.dac.token.symbol}` )
          .addField(`Max Supply`, stats.max_supply )
          .addField(`Supply`, stats.supply )
          .addField(`Issuer`, stats.issuer )
          .addField(`Locked`, stats.transfer_locked )
          .addField(`Balance of ${discorduser[0].eos_account}`, balance );
    
          message.author.send(embed);

        }
        else{
          message.author.send('I could not find the token stats.')
        }
    }
}

module.exports = cmd;