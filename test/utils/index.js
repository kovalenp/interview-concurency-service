const createEventBody = (body) => ({ body: JSON.stringify(body) });

// alb request event example taken from: https://docs.aws.amazon.com/lambda/latest/dg/services-alb.html
const createAlbEvent = (method = 'POST', path = '/concurrency', body) => ({
  requestContext: {
    elb: {
      targetGroupArn:
        'arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/lambda-279XGJDqGZ5rsrHC2Fjr/49e9d65c45c6791a',
    },
  },
  httpMethod: method,
  path,
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip',
    'accept-language': 'en-US,en;q=0.9',
    connection: 'keep-alive',
    host: 'lambda-alb-123578498.us-east-2.elb.amazonaws.com',
    'upgrade-insecure-requests': '1',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
  },
  body: JSON.stringify(body),
});

exports.createEventBody = createEventBody;
exports.createAlbEvent = createAlbEvent;
