'use strict';

import http from 'http';

let count = 0;

http.createServer((req, res) => {
  res.end((count).toString());
  if (req.url === '/') count++;
}).listen(3000);
