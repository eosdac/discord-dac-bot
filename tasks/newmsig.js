const {Base_Task} = require('../classes/abstract/Base_Task');
const Discord = require("discord.js");
const fetch = require('node-fetch');

class task extends Base_Task {

    constructor(bot, taskname) {
        super(taskname);
        this.bot = bot;
    }

    async execute(msig_data){

        try {

            const url = `${this.bot.config.dac.dac_api}/msig_proposals?proposer=${msig_data.proposer}&proposal_name=${msig_data.proposal_name}`;
            const res = await fetch(url);
            const json_res = await res.json();

            const embed_data = {
                title: `A new msig has been proposed by ${msig_data.proposer}`,
                description: `**${json_res.results[0].title}**\n\n${json_res.results[0].description}\n\nPlease visit the member client to review.`
            };
            const embed = new this.bot.embed(embed_data);
            await this.bot.client.channels.get(this.bot.config.bot.channels.custodian).send('MSIG Notify', {embed});
        }
        catch(e){
            console.error(e);
        }
    }
};

module.exports = task;