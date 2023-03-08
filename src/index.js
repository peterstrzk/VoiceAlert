const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Guild } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]});


dotenv.config({
  path: '../.env'
}); 


const token = process.env.TOKEN;

// lista użytkowników na kanale głosowym
const voiceUsers = new Set();

client.on('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    
  // ID kanału tekstowego, na którym bot ma działać
  const textChannelID = process.env.TEXT_CHANNEL_ID;
  // kanal tekstowy, na którym bot ma działać
  const textChannel = client.channels.cache.get(textChannelID);
  
  

  // sprawdź, czy użytkownik zmienił stan kanału głosowego
  if (oldState.channelId !== newState.channelId) {
    const voiceChannel = newState.channelId;
    const serverName = newState.guild.name;

    // sprawdź, czy użytkownik dołączył do kanału głosowego
    if (newState.channelId) {
      voiceUsers.add(newState.member.id);
      

      // jeśli jest to pierwszy użytkownik, wysyła informację o rozpoczęciu rozmowy
      if (voiceUsers.size === 1) {
        textChannel.send(`@everyone Rozpoczęto rozmowę na kanale głosowym ${serverName}!`);
        
      }
      // informacja o dołączeniu użytkownika do rozmowy
      textChannel.send(`@everyone ${newState.member.user.tag} dołączył do rozmowy na kanale głosowym ${serverName}.`);
    }

    // sprawdź, czy użytkownik opuścił kanał głosowy
    if (oldState.channelId) {
      voiceUsers.delete(oldState.member.id);
      // informacja o wyjściu użytkownika z rozmowy
      textChannel.send(`@everyone ${oldState.member.user.tag} opuścił rozmowę na kanale głosowym ${serverName}.`);
      
      // jeśli jest to ostatni użytkownik, wysyła informację o zakończeniu rozmowy
      if (voiceUsers.size === 0) {
        textChannel.send(`@everyone Zakończono rozmowę na kanale głosowym ${serverName}.`);
      }
      
      
    }
  }
});


client.login(token);
