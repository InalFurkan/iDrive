const express = require('express');
const router = express.Router();
const { apiRequestRaw } = require('../config/apiService');
const multer = require('multer');
const upload = multer();

router.post('/uploadFile', upload.single('file'), async (req, res) => {
    const file = req.file?.buffer;
    const klasorYolu = req.body.klasorYolu;
    const fileName = req.body.fileName;
    const hash = req.body.hash;
    const ticketID = req.session?.ticket?.ID;
    const contentType = req.file?.mimetype || 'application/octet-stream';

    if (!ticketID || !file || !klasorYolu || !fileName || !hash) {
        return res.status(400).json({ success: false, message: 'Eksik veya geçersiz veri.' });
    }

    const params = new URLSearchParams({
        ticketID: ticketID,
        dosyaAdi: fileName,
        klasorYolu: klasorYolu,
        dosyaHash: hash,
    }).toString();

    try {
        const response = await apiRequestRaw(`DosyaDirektYukle?${params}`, {
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
