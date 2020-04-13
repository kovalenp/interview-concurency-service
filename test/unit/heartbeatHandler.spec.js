const { expect } = require('chai');
const sinon = require('sinon');
const redis = require('../../src/redis');
const { createEventBody } = require('../utils/index');

const heartbeatHandler = require('../../src/handlers/heartbeat');

describe('heartbeatHandler unit tests', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('update token ttl if token is the same', async () => {
    sandbox.stub(redis, 'get').returns('laptop_football');
    sandbox.stub(redis, 'set').returns('OK');
    const response = await heartbeatHandler(
      createEventBody({ sessionKey: 'testKey_1', token: 'laptop_football' }),
    );
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(responseBody.token).to.be.equal('laptop_football');
  });
});
