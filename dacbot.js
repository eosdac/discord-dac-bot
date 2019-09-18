const config = require("./config.json");
const fs = require('fs');
const Discord = require("discord.js");
const BotApi = require("./classes/botapi.js");
const BotWSListener = require("./classes/botwslistener");
const eoswrapper = require('./classes/eoswrapper.js');
const mongowrapper = require('./classes/mongowrapper.js');


class DacBot{
    
    constructor(config){
        this.config = config;
        this.client = new Discord.Client();
        this.embed = require("discord.js").RichEmbed;
        this.eos = new eoswrapper();
        this.init();
    }

    async init(){
        await this.connectdb();
        this.loadEvents();
        this.loadCommands();
        this.loadTasks();

        await this.client.login(this.config.bot.token);

        if(this.config.bot.api.enable){
            this.botapi = new BotApi(this);
        }
        if(this.config.bot.ws.enable){
            this.botws = new BotWSListener(this);
        }
        
    }

    loadCommands(){
        this.commands = [];
        let files = fs.readdirSync(this.config.bot.commands);
        files = files.filter(f => /\.js$/.test(f) );

        files.forEach(f => {
            const cmd_obj  = new (require(`${this.config.bot.commands}/${f}`) )(this);
            if(!cmd_obj.disable){
                this.commands.push(cmd_obj);
            }
            
        });
    }

    loadEvents(){
        let files = fs.readdirSync(this.config.bot.events);
        files = files.filter(f => /\.js$/.test(f) );
        files.forEach(f => {
            console.log(`./events/${f}`)
            const event = require(`${this.config.bot.events}/${f}`);
            let eventName = f.split(".")[0];
            this.client.on(eventName, event.bind(null, this) );
        });
    }

    loadTasks(){
        this.tasks = [];
        let files = fs.readdirSync(this.config.bot.tasks);
        files = files.filter(f => /\.js$/.test(f) );
        files.forEach(f => {
            let taskname = f.split(".")[0];
            const task  = new (require(`${this.config.bot.tasks}/${f}`) )(this, taskname);
            this.tasks.push(task);
        });
    }

    getCommand(cmd_name){
        return this.commands.find(cmd => cmd.name == cmd_name);
    }

    getTask(task_name){
        return this.tasks.find(tsk => tsk.name == task_name);
    }

    async connectdb(){
        if(!this.mongo){
            this.mongo = new mongowrapper(this.config.mongo.url, this.config.mongo.dbname);
            await this.mongo.connect();
        }
    }
}

let test = new DacBot(config);