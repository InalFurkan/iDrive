const express = require('express');
const router = express.Router();
const { apiRequest } = require('../config/apiService');
const session = require("express-session");

// AJAX isteğini işleyen endpoint
router.post('/klasorListesiGetir', express.json(), async (req, res) => {
    const { path } = req.body;
    const ticketID = req.session.ticket.ID;

    try {
        // API'ye istek URL'si
        const endpoint = `KlasorListesiGetir?ticketID=${ticketID}&klasorYolu=${encodeURIComponent(path)}`;

        // API'ye istek gönder
        const result = await apiRequest(endpoint, { method: 'GET' });

        // Sonuçları döndür
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
