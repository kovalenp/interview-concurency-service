const { expect } = require('chai');
const { handler } = require('../../src/index');
const event = require('../lib/event');

describe('lambda handler', () => {
  it('lambda handler /POST concurrency', async () => {
    const result = await handler(event);
    expect(result.statusCode).to.be.equal(200);
  });
});
