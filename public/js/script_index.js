var path = "Directory_Inal";
let folders = [];
let files = [];
let username = "";

function toggleSidebar() {
    const sidebar = document.getElementById("sidepanel");
    if (sidebar.style.display === "flex") {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "flex";
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-bs-theme');

    if (currentTheme === 'light') {
        document.body.setAttribute('data-bs-theme', 'dark');
        document.body.style.backgroundColor = '#343a40'; // Koyu tema arka plan rengi
        document.getElementById('lightIcon').style.display = 'none'; // Güneş ikonunu gizle
        document.getElementById('darkIcon').style.display = 'inline'; // Ay ikonunu göster

        document.querySelectorAll('.accordion').forEach(accordion => {
            accordion.setAttribute('data-bs-theme', 'dark');
        });

    } else {
        document.body.setAttribute('data-bs-theme', 'light');
        document.body.style.backgroundColor = '#f8f9fa'; // Açık tema arka plan rengi
        document.getElementById('lightIcon').style.display = 'inline'; // Güneş ikonunu göster
        document.getElementById('darkIcon').style.display = 'none'; // Ay ikonunu gizle

        document.querySelectorAll('.accordion').forEach(accordion => {
            accordion.setAttribute('data-bs-theme', 'light');
        });
    }


    document.querySelectorAll('.accordion').forEach(accordion => {
        accordion.setAttribute('data-bs-theme', body.getAttribute('data-bs-theme'));
    });

}




window.onload = async function () {
    /*
    This function will be executed when the page is loaded
    It uses the fetch function to send a GET request to the /checkTicket endpoint. This way we are checking if the user is logged in or not.
    If the user is logged in, the username will be displayed on the page.
    If the user is not logged in, the user will be redirected to the login page.
    This way we are making sure that users can only access the page if they are logged in.
    */

    try {
        // /checkTicket adresine fetch isteği
        const response = await fetch("http://localhost:8080/checkTicket", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Session cookie'leri gönder
        });

        // Yanıtı kontrol et
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log("User login has been approved. Page  is loading...");

                username = data.username;
                console.log("Kullanıcı adı:", username);

                document.getElementById("username").textContent = username;
                loadItems();
            } else {
                console.warn("Ticket geçersiz. Giriş sayfasına yönlendiriliyor...");
                window.location.href = "http://localhost:8080/login";
            }
        } else {
            console.warn("Ticket kontrolü başarısız. Giriş sayfasına yönlendiriliyor...");
            window.location.href = "http://localhost:8080/login";
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        // Giriş sayfasına yönlendirme
        window.location.href = "http://localhost:8080/login";
    }
};

async function logoutBtnClicked() {
    /*
    This function will be executed when the user clicks the logout button.
    It uses the fetch function to send a POST request to the /logout endpoint. This way we are logging out the user.
    If the logout is successful, the user will be redirected to the login page.
    If the logout is not successful, the user will be shown a warning message.
    */

    try {
        // /logout adresine fetch isteği gönder
        const response = await fetch("http://localhost:8080/logout", {
            method: "POST", // POST isteği
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Session cookie'leri gönder
        });

        // API yanıtını kontrol et
        if (response.ok) {
            // Logout başarılı, login sayfasına yönlendir
            window.location.href = "http://localhost:8080/login";
        } else {
            // Logout başarısız, uyarı göster
            const data = await response.json();
            alert(data.message || "Logout işlemi başarısız.");
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        alert("Logout işlemi sırasında bir hata oluştu.");
    }
}


async function fetchFolders() {
    /*
    This function will be executed when the page is loaded.
    It uses the fetch function to send a GET request to the /getFolders endpoint. This way we are getting the folders from the database.
    If the request is successful, the folders will be added to the folders array.
    If the request is not successful, the user will be shown a warning message.
    */

    try {
        const response = await fetch('/klasorListesiGetir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path }) // path değişkenini gönderiyoruz
        });

        if (!response.ok) {
            throw new Error('Yerel sunucu isteği başarısız oldu.');
        }

        const result = await response.json();
        if (result.success) {
            folders = result.data.SonucKlasorListe || [];
        } else {
            console.error('Klasör ve dosya bilgisi alınamadı:', result.message);
        }
    } catch (error) {
        console.error('Hata:', error.message);
    }
}

async function fetchFiles() {
    /* 
    This function will be executed when the page is loaded.
    It uses the fetch function to send a GET request to the /getFiles endpoint. This way we are getting the files from the database.
    If the request is successful, the files will be added to the files array.
    If the request is not successful, the user will be shown a warning message.
    */

    try {
        const response = await fetch('/dosyaListesiGetir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path }) // path değişkenini gönderiyoruz
        });

        if (!response.ok) {
            throw new Error('Yerel sunucu isteği başarısız oldu.');
        }

        const result = await response.json();
        if (result.success) {
            files = result.data.SonucDosyaListe || [];
        } else {
            console.error('Klasör ve dosya bilgisi alınamadı:', result.message);
        }
    } catch (error) {
        console.error('Hata:', error.message);
    }
}


async function loadItems() {
    /*
    This function will be executed when the page is loaded.
    It executes the fetchFolders and fetchFiles functions to get the folders and files from the database.
    Then it creates the item elements and appends them to the container respective to their types.
    */

    await fetchFolders();
    await fetchFiles();

    const container = document.querySelector('#item-stack'); // Ensure this is the correct target container

    // Clear previous items if any
    container.innerHTML = '';

    // Add folders first
    folders.forEach(folder => {
        const folderElement = createItemElement(folder.Adi, 'folder');
        container.appendChild(folderElement);
    });

    // Add files afterward
    files.forEach(file => {
        const fileType = getFileType(file.Adi); // Determine file type (e.g., pdf, img, etc.)
        const fileElement = createItemElement(file.Adi, fileType, file.Boyut);
        container.appendChild(fileElement);
    });
}


function createItemElement(name, type, size = '') {
    /* 
    This function will be executed when the page is loaded.
    It creates the item elements and appends them to the container respective to their types 
    Returns the item element
    */

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', `item-${type}`);

    const imageFrame = document.createElement('div');
    imageFrame.classList.add('image-frame');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const nameParagraph = document.createElement('p');
    nameParagraph.classList.add('name', 'card-text', 'text-truncate');
    nameParagraph.textContent = name;

    const badgesDiv = document.createElement('div');
    badgesDiv.classList.add('badges');

    if (size) {
        const sizeSpan = document.createElement('span');
        sizeSpan.textContent = `${(size / 1024).toFixed(2)}MB`; // Convert size to MB
        badgesDiv.appendChild(sizeSpan);
    }

    infoDiv.appendChild(nameParagraph);
    infoDiv.appendChild(badgesDiv);
    itemDiv.appendChild(imageFrame);
    itemDiv.appendChild(infoDiv);

    return itemDiv;
}

function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase(); // Dosya uzantısı
    switch (extension) {
        case 'pdf':
            return 'pdf';
        case 'txt':
            return 'txt';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'img';
        case 'doc':
        case 'docx':
            return 'doc';
        case 'xls':
        case 'xlsx':
            return 'xls';
        default:
            return 'file'; // Genel dosya sınıfı
    }
}


function newFolderBtn() {
    // Modal'ı açmak için Bootstrap modal'ını kullanıyoruz
    const modal = new bootstrap.Modal(document.getElementById('newFolderModal'));
    document.getElementById('folderName').value = "";

    modal.show();
}

// Klasör Oluşturma Fonksiyonu
async function createFolder() {
    const folderName = document.getElementById('folderName').value.trim();


    if (!folderName) {
        alert('Please enter a folder name!');
        return;
    }

    // POST isteği gönder
    try {
        const response = await fetch('/createFolder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "klasorAdi": folderName, "klasorYolu": path }) // path değişkenini gönderiyoruz
        });

        if (!response.ok) {
            throw new Error('Yerel sunucu isteği başarısız oldu.');
        }

        const result = await response.json();
        if (result.success) {
            loadItems();
        } else {
            console.error('Could not be created', result.message);
        }
    } catch (error) {
        console.error('Hata:', error.message);
    }




    // Modal'ı kapat
    const modal = bootstrap.Modal.getInstance(document.getElementById('newFolderModal'));
    modal.hide();

    // Formu sıfırla
    document.getElementById('createFolderForm').reset();
}


