const { Client } = require('@components/DiscordClient') // eslint-disable-line
const fs = require('fs')

/**
 * Command Router untuk bot ini.
 */
module.exports = class Router {
  /**
   * @param {Client} client
   */
  constructor (client, lastGroup) {
    this.client = client
    this.lastGroup = lastGroup
  }

  /**
   * Panggil file command.
   * @param {string} file Nama filenya
   * @param {CommandFileConfiguration} config Konfigurasi untuk command file ini
   */
  load (file, config) {
    file = typeof this.lastGroup === 'undefined'
      ? file
      : `${this.lastGroup}/${file}`

    // Apabila commandnya tidak ada
    if (!fs.existsSync('./App/Command/' + file + '.js')) {
      throw new Error(`File not found in App/Command/${file}.js`)
    }

    // Buat object untuk simpan datanya di Collection
    const insertation = {
      command: config.command,
      description: config.description,
      usage: config.usage,
      run: require('../App/Command/' + file)
    }
    if (typeof config.cooldown !== 'undefined') {
      insertation.cooldown = config.cooldown
    }

    // Untuk membedakan array atau string di commandnya
    const cmd = typeof config.command === 'string'
      ? config.command
      : config.command[0]

    // Simpan commandnya di client
    this.client.commands.set(cmd, insertation)

    // Simpan ke help
    const cateName = file.match(/[/]/gm).length > 0
      ? file.split('/').join('::')
      : file
    this.client.helps.set(cateName, [])
    this.client.helps.get(cateName).push(cmd)
    this.client.console.info(`Loaded command [${cateName}]`)

    // Simpan ke alias apabila commandnya adalah array
    if (typeof config.command !== 'string') {
      const alias = config.command.slice(1)
      alias.forEach(a => this.client.aliases.set(a, cmd))
    }
  }

  /**
   * Menggabungkan perintah dalam satu grup
   * @param {string} prefix Prefix untuk groupnya, sebagai penanda
   * nama folder dalam App/Command/
   * @return {Promise<Router>} Load datanya seperti biasa
   */
  group (prefix) {
    return new Promise((resolve) => {
      prefix = typeof this.lastGroup === 'undefined'
        ? prefix
        : `${this.lastGroup}/${prefix}`
      resolve(new Router(this.client, prefix))
    })
  }
}

/**
  * Konfigurasi yang perlu dikonfigurasi untuk command yang ingin dipanggil.
  * @typedef {Object} CommandFileConfiguration
  * @property {string | string[]} command Dipanggil apa command tersebut dalam chat.
  * @property {string} description Deskripsi dari command tersebut/
  * @property {string} usage Cara penggunaan dari command tersebut.
  * @property {boolean} [moderating] Beri nilai true apabila command tersebut adalah moderation/
  * @property {number} [cooldown] Cooldown dari command anda, defaultnya adalah 5.
  */

/**
  * Callback untuk load
  * @callback LoadCommandCallback
  * @param {string} file Nama filenya
  * @param {CommandFileConfiguration} config Konfigurasi untuk command file ini
  * @return {void}
  */