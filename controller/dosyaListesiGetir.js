const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService'); // apiService modülünü içe aktar

// Define media file extensions
const mediaExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', // Images
    'mp3', 'wav', 'ogg', 'aac', 'flac', // Audio
    'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm' // Video
];

// Define document file extensions
const documentExtensions = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp' // Documents
];

// AJAX isteğini işleyen endpoint
router.post('/dosyaListesiGetir', express.json(), async (req, res) => {
    const { path, mediaOnly, documentOnly } = req.body;
    const ticketID = req.session.ticket.ID;

    try {
        // API'ye istek URL'si ve endpoint
        const endpoint = `DosyaListesiGetir?ticketID=${ticketID}&klasorYolu=${encodeURIComponent(path)}`;

        // apiRequest kullanarak API'ye istek gönder
        const result = await apiRequest(endpoint, {
            method: 'GET',
        });

        let filteredFiles = result.SonucDosyaListe || [];

        // If mediaOnly is true, filter files by media extensions
        if (mediaOnly) {
            filteredFiles = filteredFiles.filter(file => {
                const extension = file.Adi.split('.').pop().toLowerCase();
                return mediaExtensions.includes(extension);
            });
        } else if (documentOnly) {
            filteredFiles = filteredFiles.filter(file => {
                const extension = file.Adi.split('.').pop().toLowerCase();
                return documentExtensions.includes(extension);
            });
        }

        // Sonuçları döndür
        return res.status(200).json({ success: true, data: { SonucDosyaListe: filteredFiles } });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
