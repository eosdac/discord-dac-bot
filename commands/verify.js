const {Base_Command} = require('../classes/abstract/Base_Command');
const ecc = require('eosjs-ecc');

class cmd extends Base_Command{
    constructor(){
        super('verify', 'Verify if your discord account is properly linked with an eos account and check if you are a registered eosDAC member.');
    }

    async execute(bot, member, message, args){
        message.author.send('Not yet implemented');
    }
}

module.exports = cmd;