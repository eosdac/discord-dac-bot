class test2{
    constructor(){
        this.name ='hello2';
    }
    execute(bot, message, user, member){
        console.log(this.name)
    }
}

module.exports = test2;