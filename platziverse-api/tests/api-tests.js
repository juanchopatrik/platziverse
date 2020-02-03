'use strict'

const test = require('ava')
const util = require ('util')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')
const config = require ('../config')
const auth = require ('../auth')
const sign = util.promisify(auth.sign)

let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let token = {}
let MetricStub = {}
const uuid = 'yyy-yyy-yyy'

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub,
  }))

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  AgentStub.findByUuid= sandbox.stub()
  AgentStub.findByUuid.withArgs(uuid).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  token = await sign({ admin: true, username: 'platzi'}, config.auth.secret)

  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .set('authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})



test.serial.cb('/api/agent/:uuid', t => {
    request(server)
      .get(`/api/agent/${uuid}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.falsy(err, 'should not return an error')
        let body = JSON.stringify(res.body)
        let expected = JSON.stringify(agentFixtures.byUuid(uuid))
        t.deepEqual(body, expected, 'response body should be the expected')
        t.end()
      })
})


test.serial.todo('/api/agent/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not found')