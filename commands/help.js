const {Base_Command} = require('../abstract/Base_Command');

class help extends Base_Command{
    constructor(){
        super();
        this.name ='help';
        this.description = 'Lists help for all available commands';
    }

    execute(bot, member, message, args){
        let c = bot.getCommand(args[0]);

        if(c) {
            // let emb = this.embed.setColor('#00AE86')
            // .addField(args[0], c.description )
            message.author.send(c.description);
        }
        else{
            //list help for all commands
        }
        
    }
}

module.exports = help;