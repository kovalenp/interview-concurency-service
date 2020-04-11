exports.handler = async (event) => {

  console.log('Executing Hello world lambda', event)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello world', status: 'OK' }),
    headers: { 'content-type': 'application/json' },
  };;
};