"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;

const mimeLookup = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
};

const staticLocation = "./client/";
const getFileUrl = url => (url === "/" ? "index.html" : url);
const getFilePath = fileUrl => path.resolve(staticLocation + fileUrl);

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    const filePath = getFilePath(getFileUrl(req.url));
    const mimeType = mimeLookup[path.extname(filePath)];

    if (!mimeType) return;

    res.writeHead(200, { "Content-Type": mimeType });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
