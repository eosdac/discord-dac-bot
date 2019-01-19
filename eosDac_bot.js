const config = require("./config.json");
const fs = require('fs');
const Discord = require("discord.js");
const MongoClient = require('mongodb').MongoClient;


class EosDacBot{
    
    constructor(config){
        this.config = config;
        this.client = new Discord.Client();
        this.init();
    }

    async init(){
        this.loadEvents();
        this.loadCommands();
        if(!this.db){
            this.db = await this.connectDb();
        }
        this.client.login(this.config.bot.token);
    }

    loadCommands(){
        this.commands = [];
        let files = fs.readdirSync(this.config.bot.commands);
        files = files.filter(f => /\.js$/.test(f) );
        files.forEach(f => {
            const cmd_obj  = new (require(`${this.config.bot.commands}/${f}`) )();
            this.commands.push(cmd_obj);
        });
    }

    loadEvents(){
        let files = fs.readdirSync(this.config.bot.events);
        files = files.filter(f => /\.js$/.test(f) );
        files.forEach(f => {
            console.log(`./events/${f}`)
            const event = require(`./events/${f}`);
            let eventName = f.split(".")[0];
            this.client.on(eventName, event.bind(null, this) );
        });
    }

    getCommand(cmd_name){
        return this.commands.find(cmd => cmd.name == cmd_name);
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