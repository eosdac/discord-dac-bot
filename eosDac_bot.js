const config = require("./config.json");
const fs = require('fs');
const Discord = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const BotApi = require("./classes/botapi.js");
const eoswrapper = require('./classes/eoswrapper.js');


class EosDacBot{
    
    constructor(config){
        this.config = config;
        this.client = new Discord.Client();
        this.embed = require("discord.js").RichEmbed;
        this.eos = new eoswrapper();
        this.init();
    }

    async init(){
        this.loadEvents();
        this.loadCommands();
        
        if(!this.db){
            this.db = await this.connectDb();
        }

        this.client.login(this.config.bot.token);

        if(this.config.bot.api.enable){
            this.botapi = new BotApi(this);
        }
        this.loadTasks();
    }

    loadCommands(){
        this.commands = [];
        let files = fs.readdirSync(this.config.bot.commands);
        files = files.filter(f => /\.js$/.test(f) );
        files.forEach(f => {
            const cmd_obj  = new (require(`${this.config.bot.commands}/${f}`) )();
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

    async connectDb(){
        return await MongoClient.connect(this.config.mongo.url, { useNewUrlParser: true })
        .then(mongo => {
            console.log('mongo connected');
            let db = mongo.db(this.config.mongo.dbname);
            return db;
        })
        .catch(e => {
            console.log(e); 
            return false;
        });
    }
}

let test = new EosDacBot(config);