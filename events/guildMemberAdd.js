module.exports = async (bot, member) => {
    let guild = await bot.client.guilds.find(guild => guild.name === bot.config.bot.guildname);
    let m = await guild.members.get(member.id);
    console.log(`new member ${member.id}`);


    let embed = new bot.embed().setColor('#5927A3');

    embed.setDescription(`Welcome ${member} to the eosDAC Discord server. I'm the eosDAC Discord bot and I'm here to assit you. You can see my available options by typing \`$help\` or click the link below to get started.`)
    embed.setImage("https://i.imgur.com/yfclXjU.png")
    embed.addField(`**Begin-here**`, `https://discordapp.com/channels/435916207162654722/446001569780072448/546095248376594433`);

    m.send(embed);
}

