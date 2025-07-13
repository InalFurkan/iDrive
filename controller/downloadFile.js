const express = require('express');
const router = express.Router();
const { apiRequestRaw } = require('../config/apiService');

const mimeTypeMap = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'aac': 'audio/aac',
    'flac': 'audio/flac',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'rtf': 'application/rtf',
    'odt': 'application/vnd.oasis.opendocument.text',
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',
    'odp': 'application/vnd.oasis.opendocument.presentation'
};

// AJAX isteğini işleyen endpoint
router.get('/downloadFile', async (req, res) => {
    const dosyaAdi = req.query.dosyaAdi;
    const klasorYolu = req.query.klasorYolu;
    const view = req.query.view === 'true'; // Check for view parameter

    const ticketID = req.session.ticket.ID;

    console.log(dosyaAdi, klasorYolu, ticketID, view);

    try {
        // API'ye istek gönder
        const response = await apiRequestRaw('DosyaIndir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorYolu": klasorYolu,
                "dosyaAdi": dosyaAdi
            })
        });

        // API yanıtını işleme
        const fileBuffer = await response.buffer();  // Dosyayı binary olarak al

        console.log("Received fileBuffer length from API:", fileBuffer.length);

        const extension = dosyaAdi.split('.').pop().toLowerCase();
        const determinedContentType = mimeTypeMap[extension] || 'application/octet-stream';

        // Dosyayı istemciye göndermek için yanıt ayarlarını yap
        res.setHeader('Content-Type', determinedContentType); // Dosyanın içerik türünü belirt
        if (view) {
            res.setHeader('Content-Disposition', `inline; filename="${dosyaAdi}"`); // Görüntüleme için inline
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${dosyaAdi}"`); // İndirme için dosya adı
        }

        // Dosya verisini istemciye gönder
        res.send(fileBuffer); // Dosyayı istemciye gönderiyoruz
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
