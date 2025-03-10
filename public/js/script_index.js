var path = "";

let title = "Home";

let folders = [];
let files = [];

let selectedFolders = [];
let selectedFiles = [];

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

        document.getElementById("logo_dark").style.display = 'inline';
        document.getElementById("logo_light").style.display = 'none';
        document.querySelectorAll('.accordion').forEach(accordion => {
            accordion.setAttribute('data-bs-theme', 'dark');
        });

    } else {
        document.body.setAttribute('data-bs-theme', 'light');
        document.body.style.backgroundColor = '#f8f9fa'; // Açık tema arka plan rengi
        document.getElementById('lightIcon').style.display = 'inline'; // Güneş ikonunu göster
        document.getElementById('darkIcon').style.display = 'none'; // Ay ikonunu gizle

        document.getElementById("logo_dark").style.display = 'none';
        document.getElementById("logo_light").style.display = 'inline';

        document.querySelectorAll('.accordion').forEach(accordion => {
            accordion.setAttribute('data-bs-theme', 'light');
        });
    }


    document.querySelectorAll('.accordion').forEach(accordion => {
        accordion.setAttribute('data-bs-theme', body.getAttribute('data-bs-theme'));
    });

}




window.onload = async function () {
    try {
        // Use a relative path instead of a hardcoded localhost URL
        const response = await fetch("/checkTicket", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Send session cookies
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log("User login has been approved. Page is loading...");

                username = data.username;
                console.log("Username:", username);

                document.getElementById("username").textContent = username;

                loadItems();
            } else {
                console.warn("Invalid ticket. Redirecting to login page...");
                window.location.href = "/login"; // Relative path
            }
        } else {
            console.warn("Ticket validation failed. Redirecting to login page...");
            window.location.href = "/login"; // Relative path
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Redirect to login page
        window.location.href = "/login"; // Relative path
    }
};

async function logoutBtnClicked() {
    try {
        const response = await fetch("/logout", {
            method: "POST", // POST request
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Send session cookies
        });

        if (response.ok) {
            // Logout successful, redirect to login page
            window.location.href = "/login"; // Relative path
        } else {
            const data = await response.json();
            alert(data.message || "Logout failed.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
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

    document.getElementById("title").innerText = title;

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

    // Add event listeners to items
    attachItemEventListeners();
}

function createItemElement(name, type, size = '') {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', `item-${type}`);
    itemDiv.setAttribute('data-item-name', name);

    const imageFrame = document.createElement('div');
    imageFrame.classList.add('image-frame');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const nameParagraph = document.createElement('p');
    nameParagraph.classList.add('name', 'card-text', 'text-truncate');
    nameParagraph.textContent = name;

    const badgesDiv = document.createElement('div');
    badgesDiv.classList.add('badges');

    if (size && size > 0) {
        const sizeSpan = document.createElement('span');
        sizeSpan.textContent = `${(size / 1024).toFixed(2)}KB`;
        badgesDiv.appendChild(sizeSpan);
    }

    infoDiv.appendChild(nameParagraph);
    infoDiv.appendChild(badgesDiv);
    itemDiv.appendChild(imageFrame);
    itemDiv.appendChild(infoDiv);

    return itemDiv;
}


async function doubleClickItem(itemName) {
    const itemDiv = document.querySelector(`[data-item-name='${itemName}']`);
    const isFolder = itemDiv.classList.contains('item-folder');

    if (isFolder) {
        // Eğer item bir folder ise, path'i güncelle
        if (path === "") {
            path = itemName; // İlk klasör açıldığında sadece klasör adı
        } else {
            path += "/" + itemName; // İç içe klasörlere geçişte path'i güncelle
        }
        console.log(`Navigating to folder: ${path}`); // Debug için log

        // Klasör ismini global 'title' değişkenine atıyoruz
        title = itemName;
        document.getElementById("title").innerText = title; // title'ı güncelle

        // loadItems fonksiyonunu çalıştır
        await loadItems();
    } else {
        // Eğer item bir dosya ise, kullanıcıya indirme teklifini sor
        console.log(`You double clicked a file: ${itemName}`);

        showFileActionModal(itemName);

    }
}

// Modal'ı gösteren fonksiyon
function showFileActionModal(itemName) {
    // Modal'ı Bootstrap ile göster
    const myModal = new bootstrap.Modal(document.getElementById('fileActionModal'));
    myModal.show();

    // "Yes, Download" butonuna tıklandığında dosyayı indir
    document.getElementById('confirmDownloadButton').addEventListener('click', () => {
        downloadFiles([itemName]);

        myModal.hide();

    });
}


function getParentPath(currentPath) {
    // Eğer path sadece kök ("/") ise, geri gitme işlemi yapılmaz.
    const pathParts = currentPath.split('/');

    // Eğer path sadece kök ("/") ise, geri gitme işlemi yapılmaz
    if (pathParts.length <= 1) {
        return "";  // Kök klasörde geri gidilemez
    }

    // Son öğeyi çıkarıp bir üst dizine git
    pathParts.pop(); // Son öğeyi kaldır
    return pathParts.join('/');
}

function goBack() {
    const parentPath = getParentPath(path);
    if (parentPath !== path) {
        path = parentPath; // Yeni path'i güncelle

        // title'ı güncelle
        title = parentPath ? parentPath.split('/').pop() : "Home"; // Son dizini al, boşsa "Root" olarak ayarla

        console.log(`Navigating back to: ${path}`); // Debug için log
        document.getElementById("title").innerText = title; // title'ı güncelle

        loadItems();
    } else {
        console.log('Already at the root or no parent available');
    }
}

function updateButtonStates() {
    const trashBtn = document.getElementById("trash-btn");
    const renameBtn = document.getElementById("rename-btn");
    const downloadBtn = document.getElementById("download-btn");

    if ((selectedFiles.length + selectedFolders.length) === 1) {
        renameBtn.classList.remove('disabled');

    } else {
        renameBtn.classList.add('disabled');
    }

    if ((selectedFiles.length + selectedFolders.length) >= 1) {
        trashBtn.classList.remove('disabled');
    } else {
        trashBtn.classList.add('disabled');
    }

    if (selectedFiles.length > 0 && selectedFolders.length === 0) {
        downloadBtn.classList.remove('disabled');
    } else {
        downloadBtn.classList.add('disabled');
    }
}



function toggleItemSelection(item, itemName, isFolder) {
    const isSelected = item.classList.contains('selected');

    if (!isSelected) {
        item.classList.add('selected');
        if (isFolder) selectedFolders.push(itemName);
        else selectedFiles.push(itemName);
    } else {
        item.classList.remove('selected');
        if (isFolder) selectedFolders = selectedFolders.filter(name => name !== itemName);
        else selectedFiles = selectedFiles.filter(name => name !== itemName);
    }
}

// Bu fonksiyon, her item için hem tıklama hem de çift tıklama olaylarını ekler

// // Container öğesine boş bir alana tıklama olayını ekle
// function attachContainerClickListener() {
//     const container = document.getElementById('content-section'); // İçerik alanının id'si

//     container.addEventListener('click', (event) => {
//         // Eğer tıklanan hedef bir 'item' değilse, seçimleri temizle
//         if (!event.target.classList.contains('item')) {
//             // Tüm öğelerin seçimlerini kaldır
//             console.log("Tıklanan alanın içinde bir 'item' bulunamadı. Seçimler sıfırlandı.");
//             document.querySelectorAll('.item.selected').forEach(item => item.classList.remove('selected'));


//             // Seçim dizilerini sıfırla
//             selectedFolders = [];
//             selectedFiles = [];

//             // Buton durumlarını güncelle
//             updateButtonStates();
//         }
//     });
// }

let clickTimeout = null; // Çift tıklama için zamanlayıcı

function initializeEventListeners() {
    const container = document.getElementById('content-section'); // İçerik alanının ID'si

    container.addEventListener('click', (event) => {
        const item = event.target.closest('.item'); // Tıklanan öğe bir 'item' mi?

        if (item) {
            const itemName = item.getAttribute('data-item-name');
            const isFolder = item.classList.contains('item-folder');

            // Ctrl tuşu basılı değilse seçimleri sıfırla
            if (!event.ctrlKey) {
                clearSelections();
            }

            toggleItemSelection(item, itemName, isFolder); // Seçim değiştir
        } else {
            // Eğer tıklanan öğe 'item' değilse seçimleri temizle
            clearSelections();
        }
        updateButtonStates();
    });

    // Çift tıklama olayını dinle
    container.addEventListener('dblclick', (event) => {
        const item = event.target.closest('.item'); // Tıklanan öğe bir 'item' mi?

        if (item) {
            const itemName = item.getAttribute('data-item-name');
            doubleClickItem(itemName); // Çift tıklama fonksiyonu
            clearSelections();
            updateButtonStates();
        }

    });
}

function clearSelections() {
    // Seçilen tüm öğelerin seçimini kaldır
    document.querySelectorAll('.item.selected').forEach(item => item.classList.remove('selected'));

    // Seçim listelerini sıfırla
    selectedFolders = [];
    selectedFiles = [];
}

function toggleItemSelection(item, itemName, isFolder) {
    const isSelected = item.classList.contains('selected');

    if (!isSelected) {
        item.classList.add('selected');
        if (isFolder) selectedFolders.push(itemName);
        else selectedFiles.push(itemName);
    } else {
        item.classList.remove('selected');
        if (isFolder) selectedFolders = selectedFolders.filter(name => name !== itemName);
        else selectedFiles = selectedFiles.filter(name => name !== itemName);
    }
}

// Başlatıcı
initializeEventListeners();

// Event listener'ları başla

// function attachItemEventListeners() {
//     const items = document.querySelectorAll('.item');

//     items.forEach(item => {
//         // Tek tıklama olayını dinle
//         item.addEventListener('click', (event) => {
//             const itemName = item.getAttribute('data-item-name');
//             const isFolder = item.classList.contains('item-folder');

//             if (!event.ctrlKey) {
//                 // Ctrl tuşu basılı değilse, tüm seçimleri sıfırla
//                 items.forEach(otherItem => otherItem.classList.remove('selected'));
//                 selectedFolders = [];
//                 selectedFiles = [];
//             }

//             toggleItemSelection(item, itemName, isFolder);
//             updateButtonStates();
//         });

//         // Çift tıklama olayını dinle
//         item.addEventListener('dblclick', (event) => {
//             const itemName = item.getAttribute('data-item-name');
//             doubleClickItem(itemName); // Çift tıklama fonksiyonu çağrılıyor
//         });
//     });
// }

async function loadItems() {
    /*
    Bu fonksiyon, sayfa yüklendiğinde çalıştırılır.
    fetchFolders ve fetchFiles fonksiyonlarını çalıştırarak veritabanından klasörler ve dosyalar alınır.
    Ardından item öğeleri oluşturulur ve uygun container'a eklenir.
    */

    await fetchFolders();
    await fetchFiles();

    document.getElementById("title").innerText = title;

    const container = document.querySelector('#item-stack'); // Hedef container

    // Önceki öğeleri temizle
    container.innerHTML = '';

    // Klasörleri önce ekle
    folders.forEach(folder => {
        const folderElement = createItemElement(folder.Adi, 'folder');
        container.appendChild(folderElement);
    });

    // Dosyaları sonra ekle
    files.forEach(file => {
        const fileType = getFileType(file.Adi); // Dosya türünü belirle (ör. pdf, img, vb.)
        const fileElement = createItemElement(file.Adi, fileType, file.Boyut);
        container.appendChild(fileElement);
    });

    // Klasörler ve dosyalar için event listener'ları ekle
    // attachItemEventListeners();
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

        case "ppt":
        case "pptx":
            return "ppt";

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

async function removeItems() {
    if ((selectedFiles.length + selectedFolders.length) >= 1) {
        // Show the modal using pure JavaScript
        var modalBody = document.getElementById("modal-body");

        // Create a new unordered list (UL) element to display the selected files and folders
        var ul = document.createElement("ul");

        // Add list items (LI) for each selected file and folder
        selectedFiles.forEach(function (file) {
            var li = document.createElement("li");
            li.textContent = `File: ${file}`;
            ul.appendChild(li);
        });

        selectedFolders.forEach(function (folder) {
            var li = document.createElement("li");
            li.textContent = `Folder: ${folder}`;
            ul.appendChild(li);
        });

        modalBody.innerHTML = "";
        modalBody.appendChild(ul);

        // Ensure modal exists before showing it
        const modalElement = document.getElementById('confirmDeleteModal');
        if (!modalElement) {
            console.error('Modal element not found!');
            return;  // Exit if modal is not found
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        // Wait for user confirmation (click on the "delete" button)
        confirmDeleteBtn.addEventListener('click', async function () {
            try {
                console.log("Starting deletion process...");

                // Delete files sequentially
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    try {
                        const response = await fetch('/deleteFile', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ "dosyaAdi": file, "klasorYolu": path })
                        });
                        if (!response.ok) {
                            throw new Error(`Failed to delete file: ${file}`);
                        }
                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(result.message);
                        }
                        console.log(`File deleted successfully: ${file}`);
                    } catch (error) {
                        console.error(`Error deleting file ${file}:`, error.message);
                        break; // Stop further deletion if one file fails
                    }
                }

                // Delete folders sequentially after files are deleted
                for (let i = 0; i < selectedFolders.length; i++) {
                    const folder = selectedFolders[i];
                    try {
                        const response = await fetch('/deleteFolder', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ "klasorAdi": folder, "klasorYolu": path })
                        });
                        if (!response.ok) {
                            throw new Error(`Failed to delete folder: ${folder}`);
                        }
                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(result.message);
                        }
                        console.log(`Folder deleted successfully: ${folder}`);
                    } catch (error) {
                        console.error(`Error deleting folder ${folder}:`, error.message);
                        break; // Stop further deletion if one folder fails
                    }
                }

                // After all files and folders are deleted, reload the items
                loadItems();

                // Close the modal after successful deletion
                modal.hide();


            } catch (error) {
                console.error('Error during deletion:', error.message);

                // Notify user of failure
                alert("An error occurred during the deletion.");

                // Close modal in case of error
                modal.hide();
            }
        });

        // Optional: Close the modal if user presses the "İptal" (Cancel) button or clicks outside the modal
        const cancelButton = document.querySelector('.btn-secondary');
        if (cancelButton) {
            cancelButton.addEventListener('click', function () {
                modal.hide();
            });
        }
    }
}

async function renameItem() {
    // Check if exactly one item is selected
    if ((selectedFiles.length + selectedFolders.length) !== 1) {
        alert('Please select exactly one file or folder to rename.');
        return;
    }

    // Determine the selected item and its type
    let itemName, isFolder;
    if (selectedFiles.length === 1) {
        itemName = selectedFiles[0];
        isFolder = false;
    } else if (selectedFolders.length === 1) {
        itemName = selectedFolders[0];
        isFolder = true;
    } else {
        alert('Error determining the selected item.');
        return;
    }

    // Get the modal elements
    const modalElement = document.getElementById('renameItemModal');
    const modalBody = document.getElementById('rename-modal-body');
    const saveButton = document.getElementById('saveRenameBtn');

    if (!modalElement || !modalBody || !saveButton) {
        console.error('Modal elements not found!');
        return;
    }

    // Populate modal body with the current and new item name fields
    modalBody.innerHTML = `
        <div>
            <p>Current Name: <strong>${itemName}</strong></p>
            <label for="newItemNameInput">New Name:</label>
            <input type="text" id="newItemNameInput" class="form-control" value="${itemName}" />
        </div>
    `;

    // Show the modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Add click event to the save button
    saveButton.addEventListener(
        'click',
        async function onSave() {
            const newItemNameInput = document.getElementById('newItemNameInput');
            const newItemName = newItemNameInput.value.trim();

            if (!newItemName || newItemName === itemName) {
                alert('Please enter a valid new name.');
                return;
            }

            try {
                // Determine the API endpoint and body
                const endpoint = isFolder ? '/renameFolder' : '/renameFile';
                const body = JSON.stringify({
                    klasorYolu: path,
                    itemName: itemName,
                    newItemName: newItemName,
                });

                // Send POST request to rename the item
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                });

                if (!response.ok) {
                    throw new Error(`Failed to rename ${isFolder ? 'folder' : 'file'}`);
                }

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }

                console.log(`${isFolder ? 'Folder' : 'File'} renamed successfully: ${newItemName}`);

                // Reload items and close modal
                loadItems();
                modal.hide();

            } catch (error) {
                console.error('Error renaming item:', error.message);
                alert(`An error occurred while renaming the ${isFolder ? 'folder' : 'file'}.`);
            }

            // Clean up event listener to prevent duplication
            saveButton.removeEventListener('click', onSave);
        },
        { once: true } // Ensure the listener is removed after the first click
    );
}

// Global array to store files to upload
let filesToUpload = [];

function uploadFile() {
    // Get modal elements
    const modalElement = document.getElementById('uploadFileModal');
    const modalBody = document.getElementById('upload-modal-body');
    const uploadButton = document.getElementById('uploadBtn');

    if (!modalElement || !modalBody || !uploadButton) {
        console.error('Modal elements not found!');
        return;
    }

    // Populate modal body with a file input and list
    modalBody.innerHTML = `
        <form id="fileUploadForm">
            <div class="mb-3">
                <label for="fileInput" class="form-label">Choose Files:</label>
                <input type="file" id="fileInput" class="form-control" multiple />
            </div>
            <div id="fileListContainer" class="mt-3">
                <p><strong>Selected Files:</strong></p>
                <ul id="fileList" class="list-group"></ul>
            </div>
        </form>
    `;

    // Show the modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Handle file input changes
    const fileInput = document.getElementById('fileInput');
    const fileListContainer = document.getElementById('fileList');

    fileInput.addEventListener('change', function () {
        // Clear the filesToUpload array and file list UI
        filesToUpload = [];
        fileListContainer.innerHTML = '';

        // Populate filesToUpload and update the list UI
        Array.from(fileInput.files).forEach((file) => {
            filesToUpload.push(file);
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            fileListContainer.appendChild(listItem);
        });
    });

    // Add click event to the upload button
    uploadButton.addEventListener(
        'click',
        function onUpload() {
            if (filesToUpload.length === 0) {
                alert('Please select at least one file to upload.');
                return;
            }

            // Call appropriate upload functions based on file size
            filesToUpload.forEach((file) => {
                if (file.size <= 1 * 1024 * 1024) {
                    fileUpload(file);
                } else {
                    largeFileUpload(file);
                }
            });

            // Clear the array and close the modal
            filesToUpload = [];
            modal.hide();

            // Clean up event listener to prevent duplication
            uploadButton.removeEventListener('click', onUpload);
        },
        { once: true } // Ensure the listener is removed after the first click
    );
}

function fileUpload(file) {
    const reader = new FileReader();

    reader.onload = async function (event) {
        // Dosyanın binary verisi
        const fileData = event.target.result;

        const fileHash = hashMD5(fileData);

        // API'ye gönderilecek veriler
        const klasorYolu = path; // İstenilen klasör yolu
        const data = new FormData();
        data.append("file", file); // Dosya
        data.append("fileName", file.name);
        data.append("hash", fileHash);
        data.append("klasorYolu", klasorYolu);

        try {
            // Yerel sunucuya isteği gönder
            const response = await fetch("/uploadFile", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                loadItems();
            } else {
                console.error(result.message);
                alert("Dosya yükleme başarısız: " + result.message);
            }
        } catch (error) {
            console.error("Hata:", error);
            alert("Dosya yüklenirken bir hata oluştu.");
        }
    };

    reader.readAsArrayBuffer(file); // Dosyanın binary verisini oku
}




function hashMD5(fileData) {

    const spark = new SparkMD5.ArrayBuffer();
    spark.append(fileData);
    const fileHash = spark.end();

    return fileHash
}



async function splitFile(file) {
    const chunkSize = 1024 * 1024; // 1 MB
    const chunks = [];

    for (let i = 0; i < file.size; i += chunkSize) {
        // Blob olarak parçala
        const chunk = file.slice(i, i + chunkSize);

        // Binary veriye dönüştür
        const binaryChunk = await blobToBinary(chunk);
        chunks.push(binaryChunk);
    }

    return chunks;
}

function blobToBinary(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(new Uint8Array(reader.result)); // Binary veri
        };

        reader.onerror = () => {
            reject(new Error("Blob to binary conversion failed"));
        };

        reader.readAsArrayBuffer(blob);
    });
}


async function hashChunks(chunks) {
    const results = [];
    const md5Hash = "";

    for (const chunk of chunks) {
        const arrayBuffer = await chunk.arrayBuffer();

        md5Hash = hashMD5(arrayBuffer);
    }

    return results;
}



// Dosyayı işle ve her bir parçayı sunucuya gönder
async function largeFileUpload(file) {
    // Dosyayı parçalara ayır
    const chunks = await splitFile(file); // Burada chunks'ı alıyoruz
    console.log("number of chunks:" + chunks.length);



    const data = {
        dosyaAdi: file.name,
        fileSize: file.size,
        parcaSayisi: chunks.length, // Burada chunks.size yerine chunks.length olmalı
        klasorYolu: path, // path'i doğru şekilde tanımladığınızdan emin olun
    }

    // Metadata kaydını sunucuya gönder
    try {
        const response = await fetch("/createMetadataRecord", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // JSON formatını belirtin
            },
            body: JSON.stringify({
                dosyaAdi: file.name,
                parcaSayisi: chunks.length, // parça sayısı
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log("Metadata record created successfully");
            const folderId = result.tempKlasorID;


            await sendChunks(folderId);

            // Dosya yayınlama işlemi
            await dosyaYayinla(folderId);

            loadItems();
        } else {
            console.error(result.message);
            console.log("Record not created: " + result.message);
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("An error occurred while sending the request");
    }


    // Parçayı sunucuya gönderme fonksiyonu
    async function sendChunk(chunk, folderId, chunkNumber) {



        const chunkHash = hashMD5(chunk);


        // API'ye gönderilecek veriler
        const klasorYolu = path; // İstenilen klasör yolu
        const data = new FormData();
        data.append("klasorID", folderId);
        data.append("chunk", chunk);
        data.append("hash", chunkHash);
        data.append("chunkNumber", chunkNumber);

        try {
            const response = await fetch("/sendChunk", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                console.log(`Chunk ${chunkNumber + 1} sent successfully.`);
            } else {
                console.error(`Error sending chunk ${chunkNumber + 1}: ${result.message}`);
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(`Error sending chunk ${chunkNumber + 1}:`, error.message);
            alert(`Error uploading chunk ${chunkNumber + 1}`);
            throw error; // Hata oluşursa döngüyü durdurabilir
        }

    };


    async function sendChunks(folderId) {
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]; // Her bir chunk
            // sendChunk fonksiyonunu çağırıyoruz
            await sendChunk(chunk, folderId, i);
            console.log(`Chunk ${i + 1} sent successfully.`); // Başarı mesajı
        }

    }

    // Dosya yayınlama fonksiyonu
    async function dosyaYayinla(folderId) {
        const body = {
            ID: folderId,
            dosyaAdi: file.name,
            klasorYolu: path, // path'i doğru şekilde tanımladığınızdan emin olun
        };

        try {
            const publishResponse = await fetch("/dosyaYayinla", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (publishResponse.success) {
                console("dosya yayinlama başarılı");
            }

            if (!publishResponse.ok) {
                throw new Error(`Dosya yayınlama başarısız oldu: ${publishResponse.statusText}`);
            }

            console.log("Dosya başarıyla yayınlandı.");
        } catch (error) {
            console.error("Hata:", error.message);
        }
    }
}


async function showDownloadModal() {
    // Seçili dosyaların sayısını kontrol et
    if (selectedFiles.length === 0) {
        // Eğer hiç dosya seçilmediyse, modal gösterilmesin
        return;
    }


    // Modal içeriğini güncellemek için dosya listelerini hazırlama
    const modalBody = document.getElementById('downloadModalBody');
    modalBody.innerHTML = '';  // Modal içeriğini temizle

    selectedFiles.forEach(file => {
        // Her dosya için bir satır ekle
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.textContent = file;
        modalBody.appendChild(fileItem);
    });

    // Modal'ı aç
    const downloadModal = new bootstrap.Modal(document.getElementById('downloadFileModal'));
    downloadModal.show();

    // İndirme işlemini başlatmak için butonun click eventini dinle
    const confirmDownloadBtn = document.getElementById('confirmDownloadBtn');
    confirmDownloadBtn.addEventListener('click', async function () {
        console.log("Download button clicked");
        await downloadFiles(selectedFiles);
        downloadModal.hide();  // Modal'ı kapat
    });
}

async function downloadFiles(files) {
    try {
        console.log("Files to download:", files);
        for (let file of files) {
            const body = JSON.stringify({
                dosyaAdi: file,
                klasorYolu: path
            });

            // AJAX isteğini gönder
            const response = await fetch("/downloadFile", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            if (!response.ok) {
                throw new Error(`File download failed for ${file}.`);
            }

            // Sunucudan dönen dosyayı al
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Dosya indirme işlemini başlat
            const a = document.createElement('a');
            a.href = url;
            a.download = file;  // Dosyanın adı
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);  // URL'yi serbest bırak
        }
    } catch (error) {
        console.error('Error downloading files:', error.message);
        alert('An error occurred while downloading the files.');
    }
}






