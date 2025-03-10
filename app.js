const express = require("express");
const cors = require("cors");
const ticketAlRoutes = require("./controller/ticketAl");
const klasorListesiRoutes = require("./controller/klasorListesiGetir");
const dosyaListesiRoutes = require("./controller/dosyaListesiGetir");
const checkTicketRoutes = require("./controller/checkTicket");
const logoutRoutes = require("./controller/logout");
const createFolderRoutes = require("./controller/createFolder");
const deleteFileRoutes = require("./controller/deleteFile");
const deleteFolderRoutes = require("./controller/deleteFolder");
const renameFileRoutes = require("./controller/renameFile");
const renameFolderRoutes = require("./controller/renameFolder");
const fileUploadRoutes = require("./controller/fileUpload");
const createMetadataRecordRoutes = require("./controller/createMetadataRecord");
const sendChunkRoutes = require("./controller/sendChunk");
const dosyaYayinlaRoutes = require("./controller/DosyaYayinla");
const downloadFileRoutes = require("./controller/downloadFile");

const app = express();

// Enable CORS
//app.use(cors());

app.use(
    cors({
        origin: 'https://localhost:8080',
        credentials: true,
    })
);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve login.html on /login route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Use ticketAlRoutes for other API routes
app.use(ticketAlRoutes);
app.use(klasorListesiRoutes);
app.use(dosyaListesiRoutes);
app.use(checkTicketRoutes);
app.use(logoutRoutes);
app.use(createFolderRoutes);
app.use(deleteFileRoutes);
app.use(deleteFolderRoutes);
app.use(renameFileRoutes);
app.use(renameFolderRoutes);
app.use(fileUploadRoutes);
app.use(createMetadataRecordRoutes);
app.use(sendChunkRoutes);
app.use(dosyaYayinlaRoutes);
app.use(downloadFileRoutes);

const port = 8080;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
