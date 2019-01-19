
const botRouter = function (api, bot) {
    const config = bot.config;
    
    api.get("/config", async function (req, res) {
            res.status(200).send(JSON.stringify(bot.config) );
    });

}

module.exports = botRouter;