const { expect } = require('chai');
const sinon = require('sinon');
const redis = require('../../src/redis');
const { createEventBody } = require('../utils/index');
const initHandler = require('../../src/handlers/init');

describe('initHandler tests', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('returns concurrency error when more than 3 sessions are open', async () => {
    sandbox.stub(redis, 'mget').returns(['unique', 'token', 'value']);
    const response = await initHandler(
      createEventBody({
        userId: 'testUser',
        deviceId: 'laptop',
        streamId: 'football',
      }),
    );
    expect(response.statusCode).to.be.equal(403);
  });

  it('updates token if called for the same stream, client and user', async () => {
    sandbox.stub(redis, 'mget').returns(['laptop_football', null, null]);
    sandbox.stub(redis, 'set').returns('OK');
    const response = await initHandler(
      createEventBody({
        userId: 'testUser',
        deviceId: 'laptop',
        streamId: 'football',
      }),
    );
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(responseBody.status).to.be.equal('updated');
    expect(responseBody.key).to.be.equal('testUser_1');
    expect(responseBody.token).to.be.equal('laptop_football');
  });

  it('creates new token if there are free session', async () => {
    sandbox.stub(redis, 'mget').returns(['laptop_football', null, null]);
    sandbox.stub(redis, 'set').returns('OK');
    const response = await initHandler(
      createEventBody({
        userId: 'testUser',
        deviceId: 'laptop',
        streamId: 'rugby',
      }),
    );
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(responseBody.status).to.be.equal('initiated');
    expect(responseBody.key).to.be.equal('testUser_2');
    expect(responseBody.token).to.be.equal('laptop_rugby');
  });

  it('error is returned if service can not store concurrency session', async () => {
    sandbox.stub(redis, 'mget').throws(new Error('Redis connection error'));
    const response = await initHandler(
      createEventBody({
        userId: 'testUser',
        deviceId: 'laptop',
        streamId: 'rugby',
      }),
    );
    expect(response.statusCode).to.be.equal(500);
  });
});
