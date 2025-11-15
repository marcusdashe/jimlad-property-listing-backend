// 1. Import Express
const express = require('express');

// 2. Create an Express application
const app = express();

// 3. Define the port
const port = 3000;

// 4. Create a basic route for the homepage
//    app.get(path, callback)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 5. Start the server and listen for connections
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});