import Client from '../Client'
import Events from '../Events'
import { Message, MessageEmbed, TextChannel } from 'discord.js'

export default class GSPMessageDelete extends Events {
  constructor() {
    super('messageDelete')
  }

  public async run(client: Client, message: Message): Promise<any> {
    const guild = client.guilds.cache.get('302655971946135554')
    if (!guild) return
    const channel = guild.channels.cache.get('714821103360409631') as TextChannel
    if (!channel) return
    if (channel.type !== 'text') return

    const embed = new MessageEmbed()
      .setAuthor(`${message.author.tag} [${message.author.id}]`, message.author.displayAvatarURL())
      .addField('Channel', `<#${message.channel.id}>`, false)
      .addField('Content', message.content, false)
      .setTimestamp()

    channel.send(embed)
  }
}
