const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{

    constructor(){
        super('generate_api_key', 'Generate an api key to interact with the bot via http.');
        this.required_roles = ['Registered Member'];

    }

    async execute(bot, member, message, args){
        //check if discord id is in database
        let discorduser = await bot.db.collection('disordbot').find({_id: message.author.id}).toArray();
        
        let priv = await ecc.randomKey();
        let pub = ecc.privateToPublic(priv).substring(3);
    
        await bot.db.collection('disordbot').updateOne(
            { _id: message.author.id }, 
            {$set:{apikey: pub } }, 
            { upsert: true } 
        );

        let testlink = `${bot.config.bot.api.url}:${bot.config.bot.api.port}/testapi/${pub}`;

        message.author.send(`Visit the link below to test your api key \n ${testlink}`);
    }
}

module.exports = cmd;