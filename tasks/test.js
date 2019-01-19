
class task {

    constructor(){
        // super('custodians', 'List the current custodian board.');
        console.log('task started');
        this.interval = 5000;
        this.counter = 0;
        this.timer = false;
        this.start();
    }

    async start(){
        if(!this.timer){
            setInterval(()=>{console.log('sheduled task executed', this.counter); this.counter++}, this.interval)
        }
        
    }
}

module.exports = task;