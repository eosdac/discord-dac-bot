const {Base_Command} = require('../classes/abstract/Base_Command');


class cmd extends Base_Command{

    constructor(){
        super('token', `Display the tokenmetrics of EOSDAC as well as your balance.`);
        this.required_roles = ['Registered Member'];

    }

    async execute(bot, member, message, args){
        //check if discord id is in database
        let discorduser = await bot.mongo.db.collection('disordbot').find({_id: message.author.id, verified:true}).toArray();

        let [stats, balance, marketdata] = await Promise.all([
            bot.eos.getTokenStats(),
            bot.eos.getBalance(bot.config.dac.token.contract, discorduser[0].eos_account, bot.config.dac.token.symbol),
            bot.eos.getMarketData()
        ])
        let embed = new bot.embed();
        if(stats){
          
          embed.setColor('#00AE86')
          .setTitle(`Token Statistics for ${bot.config.dac.token.symbol}` )
          .addField(`Max Supply`, stats.max_supply )
          .addField(`Supply`, stats.supply )
          .addField(`Issuer`, stats.issuer )
          .addField(`Locked`, stats.transfer_locked )
          .addField(`Balance of ${discorduser[0].eos_account}`, balance );
          if(marketdata){
            embed.addField(`Current Price`, `${marketdata.current_price.usd.toFixed(6)} USD` )
            .addField(`All Time High *(${new Date(marketdata.ath_date.usd).toDateString()})*`, `${marketdata.ath.usd.toFixed(6)} USD ${marketdata.ath_change_percentage.usd.toFixed(2)}%` )
            .addField(`Market Cap`, `${marketdata.market_cap.usd.toFixed(2)} USD` )
          }
    
          message.author.send(embed);

        }
        else{
          message.author.send('I could not find the token stats.')
        }
    }

}

module.exports = cmd;