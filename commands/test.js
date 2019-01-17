class test {
    constructor(){
        this.name ='test';
    }

    execute(bot, message, user, member){
        console.log(this.name)
    }
}

module.exports = test;