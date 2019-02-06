const {Base_Command} = require('../classes/abstract/Base_Command');

class cmd extends Base_Command{

    constructor(){
        super('custodians', 'List the current custodian board.');
        this.disable = false;
    }

    async execute(bot, member, message, args){
        let custodians = await bot.eos.getCustodians();

        if(custodians){
            let embed = new bot.embed()
            .setColor('#00AE86')
            .addField(`Current Custodians (${custodians.length})`, custodians.map(c=>`[${c.cust_name}](${bot.config.dac.memberclient}/profile/${c.cust_name})`) );
     
            message.author.send(embed);
        }
        else{
            message.author.send('I could not find custodians.');
        }
    }
}

module.exports = cmd;