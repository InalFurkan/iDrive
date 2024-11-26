const express = require("express");
const router = express.Router();

// /checkTicket route
router.get("/checkTicket", (req, res) => {
    const ticket = req.session.ticket;

    if (ticket && ticket.Sonuc === true) {
        return res.json({
            success: true,
            message: "Ticket geçerli.",
            username: ticket.KullaniciAdi,
        });
    } else {
        return res.status(401).json({ success: false, message: "Geçersiz veya mevcut olmayan ticket." });
    }
});

module.exports = router;
