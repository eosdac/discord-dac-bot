class test {
    constructor(){
        this.name ='custodians';
        this.description = 'Lists the current custodian board';
    }

    execute(bot, message, user, member){
        console.log(this.name)
    }
}

module.exports = test;