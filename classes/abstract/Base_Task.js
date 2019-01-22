const eoswrapper = require('../eoswrapper.js');

class Base_Task {

    constructor(taskname, interval=false) {
      
      this.name = taskname;
      if(interval){
        this.interval = interval;
        this.start();
      }
      console.log(`Task ${this.name} loaded.`);
    }
  
    execute() {
      throw new Error('You need to implement an execute() function.');
    }

    async start(){
      if(!this.shedule){
          this.shedule = setInterval(()=>{
              this.execute();
              this.counter = this.counter ? this.counter+1 : 1;
              console.log(this.counter);
          }, this.interval);
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

module.exports = {
  Base_Task
};