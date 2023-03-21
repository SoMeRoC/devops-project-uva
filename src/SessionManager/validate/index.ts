
// function required to respond to AbuseProtection from Azure Web PubSub service.
module.exports = async function (context, req, wpsReq) {
  return wpsReq.response;
}
