
const botRouter = function (api, bot) {
    
    api.get("/testmsg", async function (req, res) {
            await bot.client.channels.get('533715309803339780').send('this is a message send to the channel triggered over http');
            res.status(200).send(JSON.stringify(bot.config) );
    });



    api.get("/createroles", async function (req, res) {
        const task = bot.getTask('createrole');
        const roles = bot.config.dac.roles.pub;

        for(let i = 0; i < roles.length; i++){
            roles[i]['result'] = await task.execute(roles[i].name, roles[i].color);
        }
        res.status(200).send(roles); 
    });

    api.get("/newperiod", async function (req, res) {
        const task = bot.getTask('newperiod');
        let f = await task.execute();
        if(f){
            res.status(200).send('success'); 
        }
        else{
            res.status(200).send('error'); 
        }
    });

    api.get("/testapi/:apikey", async function (req, res) {

        const apikey = req.params.apikey;
        if(!apikey){
            res.status(400).send({ message: 'No api key supplied.' });
            return;
        }

        try{
            let isvalid = await bot.mongo.db.collection('disordbot').find({apikey: apikey}).toArray();

            if(isvalid.length){
                let discordid = isvalid[0]._id;
                await bot.client.users.get(discordid).send(`Your api key \`${apikey}\` is working!`);
                res.status(200).send('The bot has sent you a message on Discord.' );
            }
            else{
                res.status(200).send('The api key is not valid' );
            }
        }
        catch(e){
            console.log(e);
            res.status(400).send({ message: 'Something went wrong.' });
        }    
    });

}

module.exports = botRouter;