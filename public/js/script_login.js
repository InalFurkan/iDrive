function loginBtnClicked() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var toastElement = document.getElementById('toastBox');
    var toastBody = toastElement.querySelector('.toast-body'); // Toast'un içeriği
    var toast = new bootstrap.Toast(toastElement);

    // Giriş bilgilerinin boş olup olmadığını kontrol et
    if (username == "" || password == "") {
        toastElement.classList.remove('bg-danger', 'bg-success');
        toastElement.classList.add('bg-warning'); // Sarı renk
        toastBody.textContent = "Kullanıcı adı veya şifre boş bırakılamaz!";
        toast.show();
        return;
    }

    // AJAX isteği gönder
    var data = {
        username: username,
        password: password
    };

    // Use a relative URL for the API request
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) { // Unauthorized
                    toastElement.classList.remove('bg-warning', 'bg-success');
                    toastElement.classList.add('bg-danger'); // Kırmızı renk
                    toastBody.textContent = "Hatalı kullanıcı adı veya şifre!";
                    toast.show();
                }
                throw new Error(); // Hata olursa aşağıdaki catch'e gider
            }
            return response.json();
        })
        .then(data => {
            // Başarılı giriş için mesaj göster
            toastElement.classList.remove('bg-warning', 'bg-danger');
            toastElement.classList.add('bg-success'); // Yeşil renk
            toastBody.textContent = "Giriş başarılı!";
            toast.show();

            // Kısa bir gecikme ile root dizinine yönlendirme
            setTimeout(() => {
                window.location.href = "/";
            }, 1000); // 1 saniyelik bekleme (isteğe bağlı)
        })
        .catch(() => {
            // Hata olduğunda konsola yazdırma
            console.error("Bir hata oluştu.");
        });
}
