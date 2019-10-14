const { Client, Message } = require('@components/DiscordClient') // eslint-disable-line

/**
 * @param {Client} client
 * @param {Message} message
 * @param {string[]} args
 */
module.exports = async (client, message, args) => {
  const memberBan = message.mentions.members.first() || message.guild.members.get(args[0])
  if (!memberBan) {
    message.reply(client.usage('Moderation::Ban'))
    return undefined
  }

  // Reason dari member
  const _reason = args.slice(1).join(' ')
  const reason = _reason.length > 0 ? _reason : 'Tidak ada alasan'
  const auditReason = `${reason} | ${message.author.tag}`

  if (!memberBan.bannable) {
    message.reply(`${memberBan.user.tag} tidak bisa ditendang, mungkin karena rolenya berada di atas bot ini.`)
  } else {
    memberBan.send(
      `Anda telah dibanned dari server **${message.guild.name}** oleh <@!${message.author.id}> dengan alasan:\n\`\`\`${reason}\`\`\``
    ).then(msg => {
      memberBan.ban(auditReason)
      message.reply(
      `${memberBan.user.tag} telah dibanned dari server ini dengan alasan:\n\`\`\`${reason}\`\`\``
      )
    })
  }
}
