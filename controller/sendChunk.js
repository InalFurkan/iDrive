const express = require('express');
const router = express.Router();
const { apiRequestRaw } = require('../config/apiService');
const multer = require('multer');
const upload = multer();

router.post('/sendChunk', upload.single('file'), async (req, res) => {
    const file = req.file?.buffer;
    const hash = req.body.hash;
    const tempKlasorID = req.body.klasorID;
    const parcaNumarası = req.body.chunkNumber;
    const ticketID = req.session?.ticket?.ID;
    const contentType = req.file?.mimetype || 'application/octet-stream';

    console.log("chunk is being sent");

    if (!ticketID || !file || !hash || !tempKlasorID || !parcaNumarası) {
        return res.status(400).json({ success: false, message: 'Eksik veya geçersiz veri.' });
    }

    const params = new URLSearchParams({
        ticketID: ticketID,
        tempKlasorID: tempKlasorID,
        parcaHash: hash,
        parcaNumarası: parcaNumarası
    }).toString();

    try {
        const response = await apiRequestRaw(`DosyaParcalariYukle?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
            },
            body: file,
        });

        const result = await response.json();
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
