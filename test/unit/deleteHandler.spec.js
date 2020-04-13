const { expect } = require('chai');
const sinon = require('sinon');
const redis = require('../../src/redis');
const { createEventBody } = require('../utils/index');

const deleteHandler = require('../../src/handlers/delete');

describe('deleteHandler tests', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('deleteHandler error when call Redis', async () => {
    sandbox.stub(redis, 'del').throws(new Error('Connecton error'));
    const response = await deleteHandler(createEventBody({ key: 'testKey' }));
    expect(response.statusCode).to.be.equal(
      500,
      'Status code should be HTTP 500',
    );
  });

  it('deleteHandler returns 204 when key is removed', async () => {
    sandbox.stub(redis, 'del').returns(1);
    const response = await deleteHandler(createEventBody({ key: 'testKey' }));
    expect(response.statusCode).to.be.equal(
      204,
      'Status code should be HTTP 204',
    );
  });
});
