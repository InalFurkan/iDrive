// imports
const express = require("express");
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
