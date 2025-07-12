const express = require("express");
const router = express.Router();
const session = require("express-session");
const { apiRequest } = require('../config/apiService'); // apiService modülünü içe aktar

// Express-session ayarları
router.use(
    session({
        secret: "fourty-two", // Güvenli bir secret belirleyin
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Eğer HTTPS kullanıyorsanız `secure: true` yapın
    })
);

router.post("/login", express.json(), async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı veya şifre boş olamaz." });
    }

    const user = {
        KullaniciAdi: username,
        Sifre: password,
    };

    try {
        // apiRequest kullanarak API'ye istek gönder
        const ticket = await apiRequest('TicketAl', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (ticket.Sonuc === true) {
            req.session.ticket = ticket;
            return res.json({ message: "Giriş başarılı!" });
        } else {
            return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre." });
        }
    } catch (error) {
        console.error("Hata:", error);
        return res.status(500).json({ error: "Sunucu hatası. Lütfen tekrar deneyin." });
    }
});

module.exports = router;
