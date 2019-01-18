const {Base_Command} = require('../classes/abstract/Base_Command');

class help extends Base_Command{

    constructor(){
        super('help', 'Show help for all available commands');
    }

    async execute(bot, member, message, args){
        let c = bot.getCommand(args[0]);

        if(c) {
            let embed = new this.embed();
            embed.setColor('#00AE86')
            .addField(bot.config.bot.prefix+args[0], c.description );

            message.author.send(embed);
        }
        else{
            //list help for all commands
            let embed = new this.embed();
            embed.setColor('#00AE86');

            bot.commands.forEach(c => {
                embed.addField(bot.config.bot.prefix+c.name+' '+c.parameters, c.description);
            });

            message.author.send(embed);
        }
        
    }
}

module.exports = help;