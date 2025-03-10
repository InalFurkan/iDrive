const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // HTTP istekleri için gerekli
const SparkMD5 = require('spark-md5')



// API Temel Bilgileri
const API_USERNAME = "NDSServis"; // Buraya API kullanıcı adını girin
const API_PASSWORD = "ca5094ef-eae0-4bd5-a94a-14db3b8f3950"; // Buraya API şifresini girin
const BASE_URL = "https://test.divvydrive.com/Test/Staj/";

// Authorization Header'ını oluşturma
function getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`;
}
function hashMD5(fileData) {

    const spark = new SparkMD5.ArrayBuffer();
    spark.append(fileData);
    const fileHash = spark.end();

    return fileHash
};


router.post('/createMetadataRecord', express.json(), async (req, res) => {
    const data = req.body;

    console.log("Gönderilen Veriler:", data);

    const ticketID = req.session.ticket.ID;
    const dosyaAdi = data.dosyaAdi;
    const parcaSayisi = data.parcaSayisi;
    const herBirParcaninBoyutuByte = 1024 * 1024;

    try {
        // Metadata oluşturma API isteği
        const apiUrlMetaData = `${BASE_URL}DosyaMetaDataKaydiOlustur`;

        const metaDataResponse = await fetch(apiUrlMetaData, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthorizationHeader()
            },
            body: JSON.stringify({
                ticketID,
                parcaSayisi,
                dosyaAdi,
                herBirParcaninBoyutuByte
            })
        });

        if (!metaDataResponse.ok) {
            throw new Error(`Metadata API isteği başarısız oldu: ${metaDataResponse.statusText}`);
        }

        const metaDataResult = await metaDataResponse.json();
        console.log("Metadata Başarıyla Oluşturuldu:", metaDataResult);

        return res.status(200).json({ success: true, tempKlasorID: metaDataResult.Mesaj });
    } catch (error) {
        console.error("Metadata Hatası:", error.message);
        return res.status(500).json({ success: false, message: 'Metadata API isteği başarısız.', error: error.message });
    }
});

module.exports = router;



// router.post('/createMetadataRecord', express.json(), async (req, res) => {
//     const data = req.body;

//     console.log("Gönderilen Parçalar:", data.parcalar);

//     const ticketID = req.session.ticket.ID;
//     const parcalar = data.parcalar; // Gelen parçalar (binary data olarak gelmeli)
//     const parcaSayisi = parcalar.length;
//     const dosyaAdi = data.dosyaAdi;
//     const herBirParcaninBoyutuByte = 1024 * 1024;
//     const klasorYolu = data.klasorYolu;

//     try {
//         // 1. Metadata oluşturma API isteği
//         const apiUrlMetaData = `${BASE_URL}DosyaMetaDataKaydiOlustur`;

//         const metaDataResponse = await fetch(apiUrlMetaData, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': getAuthorizationHeader()
//             },
//             body: JSON.stringify({
//                 "ticketID": ticketID,
//                 "parcaSayisi": parcaSayisi,
//                 "dosyaAdi": dosyaAdi,
//                 "herBirParcaninBoyutuByte": herBirParcaninBoyutuByte
//             })
//         });

//         if (!metaDataResponse.ok) {
//             throw new Error(`Metadata API isteği başarısız oldu: ${metaDataResponse.statusText}`);
//         }

//         const metaDataResult = await metaDataResponse.json();
//         const tempKlasorID = metaDataResult.Mesaj;

//         // 2. Parçaları yükleme
//         let i = 0;
//         for (const parca of parcalar) {
//             const parcaHash = hashMD5(Buffer.from(parca)); // MD5 hash oluşturma

//             const params = new URLSearchParams({
//                 ticketID: ticketID,
//                 tempKlasorID: tempKlasorID,
//                 parcaHash: parcaHash,
//                 parcaNumarasi: i
//             }).toString();

//             const apiUrlUpload = `${BASE_URL}DosyaParcalariYukle?${params}`;

//             const uploadResponse = await fetch(apiUrlUpload, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': getAuthorizationHeader()
//                 },
//                 body: Buffer.from(parca) // Parçayı binary olarak gönderiyoruz
//             });

//             if (!uploadResponse.ok) {
//                 throw new Error(`Parça yükleme başarısız oldu: ${uploadResponse.statusText}`);
//             }

//             console.log(`Parça ${i} başarıyla yüklendi.`);
//             i++;
//         }

//         // 3. Dosyayı yayınlama
//         const apiUrlPublish = `${BASE_URL}DosyaYayinla`;

//         const publishResponse = await fetch(apiUrlPublish, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': getAuthorizationHeader()
//             },
//             body: JSON.stringify({
//                 ticketID: ticketID,
//                 ID: tempKlasorID,
//                 dosyaAdi: dosyaAdi,
//                 klasorYolu: klasorYolu,
//             })
//         });

//         if (!publishResponse.ok) {
//             throw new Error(`Dosya yayınlama başarısız oldu: ${publishResponse.statusText}`);
//         }

//         console.log("Dosya başarıyla yayınlandı.");
//         return res.status(200).json({ success: true, data: metaDataResult });
//     } catch (error) {
//         console.error("Hata:", error.message);
//         return res.status(500).json({ success: false, message: 'Uzak API isteği başarısız.', error: error.message });
//     }
// });

