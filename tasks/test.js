const {Base_Task} = require('../classes/abstract/Base_Task');

class task extends Base_Task {

    constructor(bot){
        super();

        this.bot = bot;
        this.interval = 5000;
        this.counter = 0;
        this.shedule = false;
        this.start();
    }

    async start(){
        if(!this.shedule){
            this.shedule = setInterval(()=>{console.log('sheduled task executed', this.counter); this.counter++}, this.interval);
        }   
    }

    stop(){
        if(this.shedule){
            clearInterval(this.shedule);
        }
    }

    restart(){
        if(this.shedule){
            this.stop();
            this.start();
        }
        else{
            this.start();
        }
    }
}

module.exports = task;