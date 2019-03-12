const {Base_Command} = require('../classes/abstract/Base_Command');

class cmd extends Base_Command{

    constructor(){
        super('verify', 'Verify if your discord account is properly linked with an eos account and check if you are a registered eosDAC member.');
    }

    async execute(bot, member, message, args){
        //check if discord id is in database
        let discorduser = await bot.mongo.db.collection('disordbot').find({_id: message.author.id}).toArray();
        // console.log(discorduser);
        if(!discorduser.length) {
            message.author.send(`Please run the command \`${bot.config.bot.prefix}pair <accountname>\` first.`);
            return;
        }

        let isverified_flag = false;

        if(discorduser[0].verified){
            console.log('already verified');
            isverified_flag = true;
        }
        else{

            let actions = await bot.eos.getActions2(discorduser[0].eos_account);
            if(actions == 'error'){
                message.author.send(`There is a problem with the eos node ${bot.config.chain.historyEndpoint}/v1/chain/get_info. Please try again later.`);
                return;        
            }

            let last = actions.find(a => { 
                return a.act.account === bot.config.dac.verification_contract; 
            });

            if(!last) {
                message.author.send(`I couldn't find a verification message from eos account "${discorduser[0].eos_account}". Please run the command again or retry to verify your token ${bot.config.dac.memberclient}${bot.config.dac.memberclient_verification_path}/${discorduser[0].token}:${discorduser[0].eos_account}`);
                return;
            }

            isverified_flag = last.act.data.token === discorduser[0].token;
        }
    

        if(isverified_flag ){
            let [balance, ismember] = await Promise.all([
                bot.eos.getBalance(bot.config.dac.token.contract, discorduser[0].eos_account, bot.config.dac.token.symbol),
                bot.eos.isMember(discorduser[0].eos_account)
            ]);

            console.log(balance, ismember)

            let guild = bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
            let role = guild.roles.find(role => role.name === "Registered Member");
            let cust_role = guild.roles.find(role => role.name === "Custodian");

            await bot.mongo.db.collection('disordbot').updateOne(
                { _id: message.author.id }, 
                {$set:{ verified: true } }, 
                { upsert: true } 
            );

            let embed = new bot.embed();
            embed.setColor('#00AE86');

            embed.addField('Linked eos Account', `${discorduser[0].eos_account}`);

            if(ismember){
                embed.addField('Agreed constitution', `v${ismember.agreedtermsversion}`);
                member.addRole(role).catch(e=>console.log('add reg member role error', e) );
                embed.setDescription(`The "Registered Member" role is attached to your account ${message.author}`);
                
                let test = await bot.eos.isCustodian(discorduser[0].eos_account);
                console.log(discorduser[0].eos_account, test);
                
                if( test ){
                    console.log('add cust role')
                    await member.addRole(cust_role).catch(e=>console.log('error cust role error', e) );
                }
                else{
                    console.log('remove cust role')
                    await member.removeRole(cust_role).catch(e=>console.error(e) );
                }
            }
            else{
                member.removeRole(cust_role).catch(e=>console.error(e) );
                member.removeRole(role).catch(e=>console.error(e) );
                embed.addField('Signature required', `You need to agree the DAC constitution to be a member.`);
                embed.setDescription(`Your accounts are successfully linked. You need to sign the constitution to receive the "Registered Member" role.`);

            }

            if(balance && balance.length){
                embed.addField('Balance', `${balance}`);
            }
            else{
                embed.addField(`Balance required`, `You need to have at least 0.0001 ${bot.config.dac.token.symbol} to be an active member.`);
            }

            message.author.send(embed);
        }
        else{
            message.author.send(`Tokens don't match, verification failed. You need to verify your token ${bot.config.dac.memberclient}${bot.config.dac.memberclient_verification_path}/${discorduser[0].token}:${discorduser[0].eos_account}`);
        }
    }
}

module.exports = cmd;