const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService');

// AJAX isteğini işleyen endpoint
router.post('/renameFolder', express.json(), async (req, res) => {
    const klasorAdi = req.body.itemName;
    const yeniKlasorAdi = req.body.newItemName;
    const klasorYolu = req.body.klasorYolu;
    const ticketID = req.session.ticket.ID;

    console.log(klasorAdi, yeniKlasorAdi, klasorYolu, ticketID);

    try {
        // API'ye istek gönder
        const result = await apiRequest('KlasorGuncelle', {
            method: 'PUT',
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorAdi": klasorAdi,
                "klasorYolu": klasorYolu,
                "yeniKlasorAdi": yeniKlasorAdi
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
