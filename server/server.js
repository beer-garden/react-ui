const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const root = path.join(__dirname, '../build');

app.use(cors());

app.use(express.static(root));

app.get('/*', function (req, res) {
    res.sendFile(path.join(root, "index.html"));
  });

app.listen(4000);
