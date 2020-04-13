const { expect } = require('chai');
const { healthHandler } = require('../../src/handlers');

describe('healthCheck handler unit test', () => {
  it('healthHandler returns true', () => {
    const result = healthHandler({ request: 'test request' });
    expect(result.statusCode).to.be.equal(200, 'Status code is HTTP200');
    expect(JSON.parse(result.body).healthy).to.be.equal(true);
  });
});
