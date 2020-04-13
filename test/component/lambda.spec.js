const { expect } = require('chai');
const redis = require('../../src/redis');
const { handler } = require('../../src/index');
const { createAlbEvent } = require('../utils');
const httpMethods = require('../../src/enums/httpMethods');

describe('lambda handler router tests', () => {
  const playbackInitEvent = createAlbEvent(httpMethods.POST, '/concurrency', {
    deviceId: 'phone',
    userId: 'testUser',
    streamId: 'seahawks',
  });

  const deleteEvent = createAlbEvent(httpMethods.DELETE, '/concurrency', {
    sessionKey: 'testUser_1',
  });

  const updateEvent = createAlbEvent(httpMethods.PUT, '/concurrency', {
    sessionKey: 'testUser_1',
    token: 'phone_seahawks',
  });

  const wrongMethodEvent = createAlbEvent(httpMethods.GET, '/concurrency', {});
  const wrongRouteEvent = createAlbEvent(httpMethods.POST, '/noSuchRoute', {});

  before(async () => {
    await redis.flushdb();
  });

  after(async () => {
    await redis.flushdb();
  });

  it('lambda handler /POST concurrency returns HTTP 200', async () => {
    const result = await handler(playbackInitEvent);
    const body = JSON.parse(result.body);
    expect(result.statusCode).to.be.equal(200);
    expect(body.sessionKey).to.be.equal('testUser_1');
    expect(body.token).to.be.equal('phone_seahawks');
  });

  it('lambda handler /DELETE concurrency returns HTTP 204', async () => {
    const result = await handler(deleteEvent);
    expect(result.statusCode).to.be.equal(204);
  });

  it('lambda handler /PUT concurrency returns HTTP 200', async () => {
    const result = await handler(updateEvent);
    const body = JSON.parse(result.body);
    expect(result.statusCode).to.be.equal(200);
    expect(body.sessionKey).to.be.equal('testUser_1');
    expect(body.token).to.be.equal('phone_seahawks');
  });

  it('lambda handler /GET concurrency return error HTTP 405', async () => {
    const result = await handler(wrongMethodEvent);
    expect(result.statusCode).to.be.equal(405);
  });

  it('lambda handler non existing route returns HTTP 404', async () => {
    const result = await handler(wrongRouteEvent);
    expect(result.statusCode).to.be.equal(404);
  });
});

describe('lambda handler input parameters validation', () => {
  const missingDeviceId = createAlbEvent(httpMethods.POST, '/concurrency', {
    userId: 'testUser',
    streamId: 'seahawks',
  });

  const missingStreamId = createAlbEvent(httpMethods.POST, '/concurrency', {
    userId: 'testUser',
    deviceId: 'laptop',
  });

  const missingUserId = createAlbEvent(httpMethods.POST, '/concurrency', {
    deviceId: 'laptop',
    streamId: 'seahawks',
  });

  it('/POST concurrency deviceId is mandatory parameter', async () => {
    const result = await handler(missingDeviceId);
    const body = JSON.parse(result.body);
    expect(result.statusCode).to.be.equal(400);
    expect(body.message).to.be.equal('"deviceId" is required');
  });

  it('/POST concurrency userId is mandatory parameter', async () => {
    const result = await handler(missingUserId);
    const body = JSON.parse(result.body);
    expect(result.statusCode).to.be.equal(400);
    expect(body.message).to.be.equal('"userId" is required');
  });

  it('/POST concurrency streamId is mandatory parameter', async () => {
    const result = await handler(missingStreamId);
    const body = JSON.parse(result.body);
    expect(result.statusCode).to.be.equal(400);
    expect(body.message).to.be.equal('"streamId" is required');
  });
});

// These tests could be extended to cover real world scenario of calling /POST endpoint multiple times
// A lot of tests were omitted for time saving purposes
