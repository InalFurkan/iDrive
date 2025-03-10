const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // HTTP istekleri için gerekli


// API Temel Bilgileri
const API_USERNAME = "NDSServis"; // Buraya API kullanıcı adını girin
const API_PASSWORD = "ca5094ef-eae0-4bd5-a94a-14db3b8f3950"; // Buraya API şifresini girin
const BASE_URL = "https://test.divvydrive.com/Test/Staj/";

// Authorization Header'ını oluşturma
function getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`;
}


// AJAX isteğini işleyen endpoint
router.post('/deleteFolder', express.json(), async (req, res) => {
    const klasorAdi = req.body.klasorAdi;
    const klasorYolu = req.body.klasorYolu;

    const ticketID = req.session.ticket.ID;

    console.log(klasorAdi, klasorYolu, ticketID);

    try {
        // API'ye istek URL'si
        const apiUrl = `${BASE_URL}KlasorSil`;

        // API'ye istek gönder
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthorizationHeader()
            },
            body: JSON.stringify({
                "ticketID": ticketID,
                "klasorAdi": klasorAdi,
                "klasorYolu": klasorYolu
            })
        });

        if (!response.ok) {
            throw new Error(`API isteği başarısız oldu: ${response.statusText}`);
        }

        // API yanıtını işle
        const result = await response.json();

        // Sonuçları döndür
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
    }
});

module.exports = router;
