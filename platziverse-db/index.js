'use strict'

require('longjohn')
const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const setupAgent = require ('./lib/agent')
const setupMetric = require('./lib/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  //se usa para hacer pruebas proxys
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    //creamos la base de datos en el servidor, si existe la borramos y creamos una nueva
    await sequelize.sync({force:true})
  }

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel,AgentModel)

  return {
    Agent,
    Metric
  }
}