import https from "https";

const PORT = process.env.PORT || 9000;

const httpsServer = https.createServer(async function(req, res){})

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});