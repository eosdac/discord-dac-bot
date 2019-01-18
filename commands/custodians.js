const {Base_Command} = require('../classes/abstract/Base_Command');

class test extends Base_Command{
    constructor(){
        super('custodians', 'Lists the current custodian board');
    }

    execute(bot, message, user, member){
        console.log(this.name)
    }
}

module.exports = test;