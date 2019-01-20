const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot){
        //set ms to execute the task at specific interval. 
        var interval = 0;//ms
        super(interval);

        this.bot = bot;

    }

    async execute(){
        console.log('task executed');
    }


}

module.exports = task;