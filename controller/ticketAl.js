const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const session = require("express-session");

// Express-session ayarları
router.use(
    session({
        secret: "fourty-two", // Güvenli bir secret belirleyin
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Eğer HTTPS kullanıyorsanız `secure: true` yapın
    })
);

// Basic Authorization bilgileri
const API_USERNAME = "NDSServis";
const API_PASSWORD = "ca5094ef-eae0-4bd5-a94a-14db3b8f3950";
const BASE_URL = "https://test.divvydrive.com/Test/Staj/";

module.exports = { API_USERNAME, API_PASSWORD, BASE_URL };

router.post("/login", express.json(), async (req, res) => {
    const { username, password } = req.body;

    // Giriş bilgilerinin boş olup olmadığını kontrol et
    if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı veya şifre boş olamaz." });
    }

    // Kullanıcıyı hazırlayın
    const user = {
        KullaniciAdi: username,
        Sifre: password,
    };

    try {
        // API'ye istek gönder
        const response = await fetch(`${BASE_URL}TicketAl`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`,
            },
            body: JSON.stringify(user),
        });

        // API yanıtını işle
        const ticket = await response.json(); // Cevap JSON formatında alınır

        // API cevabına göre işlem
        if (ticket.Sonuc === true) {
            // Session oluştur ve ticket nesnesini kaydet
            req.session.ticket = ticket;
            return res.json({ message: "Giriş başarılı!" });
        } else {
            // Başarısız giriş
            return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre." });
        }
    } catch (error) {
        console.error("Hata:", error);
        return res.status(500).json({ error: "Sunucu hatası. Lütfen tekrar deneyin." });
    }
});

module.exports = router;
