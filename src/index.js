const redis = require('./redis')

exports.handler = async (event) => {

  console.log('Executing Hello world lambda', event)

  await redis.set('test', 'works', 'EX', 60);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello world', status: 'OK' }),
    headers: { 'content-type': 'application/json' },
  };;
};