import { Message } from 'discord.js'
import Client from '../../Client'
import Command from '../../Command'
import Axios from 'axios'
import Moment from 'moment'

export default class Osu extends Command {
  constructor() {
    super({
      name: 'osu',
      description: 'Menampilkan statistik player osu!',
      args: [
        { name: 'username', require: true, type: 'BLOCK' },
        { name: 'mode', require: false, type: 'BLOCK'}
      ],
      example: 'osu Mednoob std'
    })
  }
  
  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    let modeList = ['std', 'ctb', 'mania', 'taiko', 'osu!std', 'osu!ctb', 'osu!mania', 'osu!taiko']
    let user = args[0]
    
    if(!user) return message.reply("Berikan username untuk di cari");
    
    let mode = args.pop()
    let modestring = ''
    
    if(modeList.includes(mode)) {
    
      switch(mode) {
      
        case "std" || "osu!std":
          mode = 0
          modestring = 'standard(std)'
          break;
        
        case "taiko" || "osu!taiko":
          mode = 1
          modestring = 'taiko'
          break;
          
        case "ctb" || "osu!ctb":
          mode = 2
          modestring = 'catch the beat(ctb)'
          break;
          
        case "mania" || "osu!mania":
          mode = 3
          modestring = 'mania'
          break;
          
      }
      
    } else user = user + mode;
    
    const result = await Axios.get(`https://osu.ppy.sh/api/get_user?k=API_KEY_OSU&u=${user}&m=${mode}`) 
    //API_KEY_OSU bisa di ganti dengan API Key osu! mu yang bisa di dapat dari http://osu.ppy.sh/p/api
    
    if(result.length < 1) return message.reply('username osu! yang anda cari tidak dapat ditemukan')
    
    const firstresult = result[0]
    
    return message.channel.send({embed: {
      author: {
      
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({format: 'png', dynamic: true})
        
      },
      
      title: `${firstresult.username}`,
      description: `Mode: ${modestring}`
      fields: [
      
        {
        
          name: 'Tanggal Pembuatan Akun',
          value: Moment(firstresult.join_date).format('DD MMMM, YYYY'),
          inline: true
          
        },
        {
        
          name: 'Rank',
          value: `Global: ${firstresult.pp_rank}
Negara(${firstresult.country}): ${firstresult.pp_country_rank}`,
          inline: true
          
        },
        {
        
          name: 'Statistik dalam Bermain',
          value: `Silver SS: ${firstresult.count_rank_ssh}
SS: ${firstresult.count_rank_ss}
Silver S: ${firstresult.count_rank_sh}
S: ${firstresult.count_rank_s}
A: ${firstresult.count_rank_a}`,
          inline: false
          
        }
        
      ]
    }})
  }
}
