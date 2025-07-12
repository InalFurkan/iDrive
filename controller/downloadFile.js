const express = require('express');
const router = express.Router();
const { apiRequestRaw } = require('../config/apiService');

// AJAX isteğini işleyen endpoint
router.post('/downloadFile', express.json(), async (req, res) => {
    const dosyaAdi = req.body.dosyaAdi;
    const klasorYolu = req.body.klasorYolu;

    const ticketID = req.session.ticket.ID;

    console.log(dosyaAdi, klasorYolu, ticketID);

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
        const contentType = response.headers.get('Content-Type');  // Dosyanın türünü al
        const fileBuffer = await response.buffer();  // Dosyayı binary olarak al

        // Dosyayı istemciye göndermek için yanıt ayarlarını yap
        res.setHeader('Content-Type', contentType); // Dosyanın içerik türünü belirt
        res.setHeader('Content-Disposition', `attachment; filename="${dosyaAdi}"`); // İndirme için dosya adı

        // Dosya verisini istemciye gönder
        res.send(fileBuffer); // Dosyayı istemciye gönderiyoruz
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
