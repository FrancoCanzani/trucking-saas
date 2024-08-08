const ping = require('ping')
 
export async function GET(request: Request) {
  const host ='https://www.openstatus.dev/';

  const result = await ping.promise.probe(host);
  
  return new Response(result, {
    status: 200,
  })
}
