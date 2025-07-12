const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService');

// AJAX isteğini işleyen endpoint
router.post('/renameFile', express.json(), async (req, res) => {
    const dosyaAdi = req.body.itemName;
    const yeniDosyaAdi = req.body.newItemName;
    const klasorYolu = req.body.klasorYolu;
    const ticketID = req.session.ticket.ID;

    try {
        // API'ye istek gönder
        const result = await apiRequest('DosyaGuncelle', {
            method: 'PUT',
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorYolu": klasorYolu,
                "dosyaAdi": dosyaAdi,
                "yeniDosyaAdi": yeniDosyaAdi
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
