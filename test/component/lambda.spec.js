const { expect } = require('chai');
const { handler } = require('../../src/index');
const { createAlbEvent } = require('../utils');

describe('lambda handler', () => {
  const playbackInitEvent = createAlbEvent('POST', '/concurrency', {
    deviceId: 'phone',
    userId: 'testUser',
    streamId: 'seahawks',
  });

  const deleteEvent = createAlbEvent('DELETE', '/concurrency', {
    sessionKey: 'testUser_1',
  });

  it('lambda handler /POST concurrency', async () => {
    const result = await handler(playbackInitEvent);
    expect(result.statusCode).to.be.equal(200);
  });

  it('lambda handler /DELETE concurrency', async () => {
    const result = await handler(deleteEvent);
    expect(result.statusCode).to.be.equal(204);
  });
});
