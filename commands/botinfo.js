const {Base_Command} = require('../classes/abstract/Base_Command');

class help extends Base_Command{

    constructor(){
        super('botinfo', 'Show some info about the bot');
    }

    async execute(bot, member, message, args){
        let embed = new bot.embed().setColor('#00AE86');

        embed.addField(`DAC`, `${bot.config.dac.name}`);
        embed.addField(`Guild`, `${bot.config.bot.guildname}`);
        embed.addField(`Network`, `${bot.config.chain.name} \n*${bot.config.chain.chainId}*`);
        embed.addField(`Eos Nodes`, `main: ${bot.config.chain.httpEndpoint}, history: ${bot.config.chain.historyEndpoint}`);
        embed.addField(`HTTP Api`, `${bot.config.bot.api.enable?'enabled':'disabled'}`);

        message.author.send(embed);
    }

}

module.exports = help;