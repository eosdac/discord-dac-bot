const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../api/routes.js");

class BotApi{

    constructor(bot){
        this.bot = bot;
        this.api = express();
        this.api.use(bodyParser.json());
        this.api.use(bodyParser.urlencoded({ extended: true }));
        
        if(this.bot.config.bot.api.enable_cors){
            this.api.use(function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
        }

        routes(this.api, this.bot);

        const server = this.api.listen(this.bot.config.bot.api.port, () => {
            console.log("Bot api running on port.", server.address().port);
            this.bot.api_online = true;
        });
    }
}

module.exports = BotApi;