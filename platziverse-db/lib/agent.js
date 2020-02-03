'use strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate(agent) {
    const cond = {
      where:{
        //el uuid que reciba debe ser el mismo del parametro
        uuid: agent.uuid
      }
    }

    const existingAgent = await AgentModel.findOne(cond)

    if (existingAgent) {
      const update = await AgentModel.update(agent,cond)
      return update ? AgentModel.findOne(cond) : existingAgent
    }
    const result = await AgentModel.create(agent)
    return result.toJSON() 
  }
  
  function findById (id) {
    return AgentModel.findById(id)
  }

  function findByUuid(uuid) {
    return AgentModel.findOne({
      where:{
        uuid
      }
    })
  }

  function findAll() {
    return AgentModel.findAll()
  }

  function findConnected() {
    return AgentModel.findAll({
      where:{
        connected: true
      }
    })
  }

  function findByUsername(username) {
    return AgentModel.findAll({
      username,
      connected:true
    })
  }

  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUsername

  }
}