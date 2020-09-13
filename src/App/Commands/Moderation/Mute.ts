import { Message } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'

export default class Ping extends Command {
  constructor() {
    super({
      name: 'mute',
      description: 'Mute user.',
      args: [
        { name: 'userID|mention', require: true, type: 'BLOCK' },
        { name: 'reason', require: false, type: 'BLOCK' }
      ],
      example: 'mute 709668494563868695 harrass'
    })
  }

  public async run(_client: Client, message: Message, _args: string[]): Promise<any> {
    message.channel.send('It works')
  }
}
