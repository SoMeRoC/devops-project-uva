
// function required to respond to AbuseProtection from Azure Web PubSub service.
export default async function (context: any, req: any, wpsReq: any) {
  return wpsReq.response;
}
