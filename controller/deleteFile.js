const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService');

// AJAX isteğini işleyen endpoint
router.post('/deleteFile', express.json(), async (req, res) => {
    const dosyaAdi = req.body.dosyaAdi;
    const klasorYolu = req.body.klasorYolu;

    const ticketID = req.session.ticket.ID;

    console.log(dosyaAdi, klasorYolu, ticketID)

    try {
        // API'ye istek gönder
        const result = await apiRequest('DosyaSil', {
            method: 'DELETE',
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorYolu": klasorYolu,
                "dosyaAdi": dosyaAdi
            })
        });

        // Sonuçları döndür
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
