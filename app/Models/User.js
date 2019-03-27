'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  teamJoins () {
    return this.hasMany('App/Models/UserTeam')
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  teams () {
    return this.belongsToMany('App/Models/Team').pivotModel(
      'App/Models/UserTeam'
    )
  }

  async is (exporession) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()

    return team.is(exporession)
  }

  async can (exporession) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()

    return team.can(exporession)
  }

  async scope (required) {
    const team = await this.teamJoins()
      .where('team_id', this.currentTeam)
      .first()

    return team.scope(required)
  }
}

module.exports = User
