
const botRouter = function (api, bot) {
    const config = bot.config;
    
    api.get("/testmsg", async function (req, res) {
            await bot.client.channels.get('533715309803339780').send('this is a message send to the channel triggered over http');
            res.status(200).send(JSON.stringify(bot.config) );
    });

}

module.exports = botRouter;