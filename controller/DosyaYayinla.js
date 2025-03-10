const express = require('express');
const fetch = require('node-fetch');  // HTTP istekleri için gerekli
const router = express.Router();

// API Temel Bilgileri
const API_USERNAME = "NDSServis"; // API kullanıcı adı
const API_PASSWORD = "ca5094ef-eae0-4bd5-a94a-14db3b8f3950"; // API şifresi
const BASE_URL = "https://test.divvydrive.com/Test/Staj/"; // Base URL

// Authorization Header'ını oluşturma
function getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`;
}

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

    const dosyaYayinlaBilgi = {
        ticketID: ticketID,
        ID: ID,
        dosyaAdi: dosyaAdi,
        klasorYolu: klasorYolu
    };

    try {
        // API URL
        const apiUrl = `${BASE_URL}DosyaYayinla`;

        // Fetch API ile POST isteği gönderimi
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': getAuthorizationHeader(),
                'Content-Type': 'application/json', // JSON formatında veri gönderiyoruz
            },
            body: JSON.stringify({
                "ticketID": ticketID,
                "ID": ID,
                "dosyaAdi": dosyaAdi,
                "klasorYolu": klasorYolu
            }) // Body kısmında JSON verisi gönderiyoruz
        });

        // Eğer API isteği başarısız olursa
        if (!response.ok) {
            throw new Error(`Dosya Yayınlama Başarısız: ${response.statusText}`);
        }

        // Başarı durumunda yanıt
        const responseData = await response.json();
        console.log("Dosya başarıyla yayınlandı:", responseData);
        return res.status(200).json({ success: true, message: 'Dosya başarıyla yayınlandı.', data: responseData });
    } catch (error) {
        // Hata durumunda yanıt
        console.error("Hata:", error.message);
        return res.status(500).json({ success: false, message: 'Dosya yayınlama başarısız.', error: error.message });
    }
});

module.exports = router;
