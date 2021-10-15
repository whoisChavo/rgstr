const Discord = require('discord.js');
const client = new Discord.Client({ restTimeOffset: 10 });       
const config = require("./Configuration/Config.json");
const settings = require("./Configuration/Settings.json");
const fs = require("fs");
const db = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const AsciiTable = require('ascii-table');
global.conf = config; 
global.client = client;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
let Prefix = config.Bot.Prefix;


fs.readdirSync('./Commands').forEach(dir => {
const commandFiles = fs.readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const salvo = require(`./Commands/${dir}/${file}`);
  var table = new AsciiTable('Salvatore Command Table');
  table.setHeading("Command", 'Status', "Aliases")
  if (salvo.help.name) {
  client.commands.set(salvo.help.name, salvo);
  table.addRow(salvo.help.name, "✔️", salvo.conf.aliases)
} else {
  table.addRow(salvo.help.name, "❌")
  continue;
    }
    salvo.conf.aliases.forEach(alias => {
      client.aliases.set(alias, salvo.help.name);
    });
    console.log(table.toString())
  }
})


client.on("message", async message => {
    if(!message.author.id == config.Sahip) return;
    if (message.content === "gir") {
        client.emit(
            "guildMemberAdd",
            message.member || (await message.guild.fetchMember(message.author))
        );
    }
});

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(Prefix)) return;
  let command = message.content.split(' ')[0].slice(Prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
});




/////////////////
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === config) permlvl = 4;
  return permlvl;
};


client.on('ready', () => {
  console.log(`Bot ${client.user.tag} Kullanıcı Adıyla Giriş Yaptı!`);

});
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: config.Bot.Activity }, status: config.Bot.Status }, {type: config.Bot.Status_Type});
  client.channels.cache.get(config.Bot.Voice_Channel).join().catch();
 });


const backup = () => {
  fs.copyFile('./json.sqlite', `./Database/Data • ${moment().format('D-M-YYYY • H.mm.ss')} • salvocode.sqlite`, err => {
      if (err) return console.log(err);
      console.log(`Database Yedeklendi. ${moment().format('D-M-YYYY - H.mm.ss')}`);
  });
};
client.on('ready', () => {
  setInterval(() => backup(), 1000 * 60 * 60 * 24); 
});

//////
client.on("guildMemberAdd", member => { 
    const moment = require('moment');
  const kanal = ayarlar.giriskanal;
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
    const tarih = new Date().getTime() - user.createdAt.getTime();  
  const embed = new Discord.MessageEmbed()
  let rol = ayarlar.kayıtsızROL
 member.roles.add(rol)

  var kontrol;
if (tarih < 1296000000) kontrol = ' ** <a:carpi:847500546314338306>** '
if (tarih > 1296000000) kontrol = ' ** <a:confirmation:847500517255938088>** '
  moment.locale("tr");
  let kanal1 = client.channels.cache.find(x => x.id === kanal);
    let giris = new Discord.MessageEmbed()
    .setDescription(`
 **        <a:tac1:847476506396459038>     __Verus Sunucusuna Hoşgeldin__ ${member} **
 
 **<a:yldz1:847477107696992307>   • Seninle birlikte Toplamda ${member.guild.memberCount} kişiyiz.**
 
 **<a:yldz1:847477107696992307>   • Hesabın Oluşturulma Tarihi: \n • \` ${moment(member.user.createdAt).format("YYYY DD MMMM dddd (hh:mm:ss)")} \` **  ** ${kontrol} **
 
 **<a:yldz1:847477107696992307>   • <@&${ayarlar.yetkiliROL}> Rolündeki Arkadaşlar Seni Kayıt Edicektir**

 **<a:yldz1:847477107696992307>   • Tagımıza Ulaşmak İçin Herhangi Bir Kanala __.tag__ Yazman Yeterli Olucaktır.**

 **<a:yldz1:847477107696992307>   • Tagımızı adına nasıl ekliyecegini bilmiyorsan <#846873757149560922> kanalına bakabilirsin.** 
 
 **<a:yldz1:847477107696992307>   • <#846873928969355284> , <#846873962197286943> , <#846874257740922911> , <#846874318675640331> , <#846874385117478912> \n\nYukaridaki Ses Kanallarında Teyit Vererek Kayıt Olabilirsiniz. **

`)
    .setImage('')
    .setTimestamp()
    
      client.channels.cache.find(x => x.id === kanal).send(`<@&${ayarlar.yetkiliROL}>`)
client.channels.cache.find(x => x.id === kanal).send(giris)
    
  });

client.on("guildMemberAdd", member => {
member.setNickname(settings.Server.Register_Name) 
});


client.login(process.env.token);