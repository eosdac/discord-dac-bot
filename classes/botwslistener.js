const WebSocket = require('ws');

class BotWSListener{

    constructor(bot){
        this.bot = bot;
        let my_ws_index = 0;

        const ws = new WebSocket(bot.config.bot.ws.endpoint);
        ws.onmessage = async (msg) => {
            const msg_obj = JSON.parse(msg.data);
            console.log(msg.data);

            if (msg_obj.type === 'notification'){
                if (msg_obj.data.notify === 'MSIG_PROPOSED'){
                    const task = this.bot.getTask('newmsig');
                    await task.execute(msg_obj.data);
                }
                else if (msg_obj.data.notify === 'NEW_PERIOD'){
                    const task = this.bot.getTask('newperiod');
                    await task.execute();
                }
            }
        };
        ws.onopen = () => {
            console.log(`websocket opened with index ${my_ws_index}`);
            ws.send(JSON.stringify({type:'register', data:{dac_id:bot.config.dac.dac_id}}));
        };
    }
}

module.exports = BotWSListener;