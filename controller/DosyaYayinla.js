const express = require('express');
const { apiRequest } = require('../config/apiService');
const router = express.Router();

// DosyaYayinla POST isteği
router.post('/dosyaYayinla', express.json(), async (req, res) => {
    // Gelen veriyi almak
    const { ID, dosyaAdi, klasorYolu } = req.body;
    const ticketID = req.session?.ticket?.ID;

    console.log("dosyaYayinla mesaj: " + ID, dosyaAdi, klasorYolu);

    // Gelen parametreler kontrol ediliyor
    if (!ticketID || !ID || !dosyaAdi || !klasorYolu) {
        return res.status(400).json({ success: false, message: 'Eksik parametre.' });
    }

    try {
        // Fetch API ile POST isteği gönderimi
        const responseData = await apiRequest('DosyaYayinla', {
            method: 'POST',
            body: JSON.stringify({
                "ticketID": ticketID,
                "ID": ID,
                "dosyaAdi": dosyaAdi,
                "klasorYolu": klasorYolu
            })
        });

        // Başarı durumunda yanıt
        console.log("Dosya başarıyla yayınlandı:", responseData);
        return res.status(200).json({ success: true, message: 'Dosya başarıyla yayınlandı.', data: responseData });
    } catch (error) {
        // Hata durumunda yanıt
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Dosya yayınlama başarısız.', error: error.message });
    }
});

module.exports = router;
