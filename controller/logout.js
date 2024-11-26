const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
    // Session'ı sonlandır
    req.session.destroy((err) => {
        if (err) {
            // Eğer session silme sırasında bir hata oluşursa
            return res.status(500).json({ message: "Logout sırasında bir hata oluştu." });
        }

        // Başarılı logout işlemi sonrası, login sayfasına yönlendirme
        res.clearCookie("connect.sid"); // Session cookie'lerini temizle
        return res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
    });
});

module.exports = router;
