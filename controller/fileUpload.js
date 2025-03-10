const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const upload = multer();

const API_USERNAME = "NDSServis";
const API_PASSWORD = "ca5094ef-eae0-4bd5-a94a-14db3b8f3950";
const BASE_URL = "https://test.divvydrive.com/Test/Staj/";

function getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`;
}

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
        const apiUrl = `${BASE_URL}DosyaDirektYukle?${params}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Authorization': getAuthorizationHeader(),
            },
            body: file,
        });

        if (!response.ok) {
            const errorText = await response.text(); // Hata detayını logla
            throw new Error(`API isteği başarısız oldu: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
