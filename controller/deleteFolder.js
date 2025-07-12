const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService');

// AJAX isteğini işleyen endpoint
router.post('/deleteFolder', express.json(), async (req, res) => {
    const klasorAdi = req.body.klasorAdi;
    const klasorYolu = req.body.klasorYolu;

    const ticketID = req.session.ticket.ID;

    console.log(klasorAdi, klasorYolu, ticketID);

    try {
        // API'ye istek gönder
        const result = await apiRequest('KlasorSil', {
            method: 'DELETE',
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorAdi": klasorAdi,
                "klasorYolu": klasorYolu
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
