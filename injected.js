function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function setUserData(domain,placeQrCod,Url,Redirect) {
const settings = {
    domain: domain,
    placeQrCod: placeQrCod,
    Url: Url,
    Redirect: Redirect
};

localStorage.setItem(domain, JSON.stringify(settings));
}

function getUserData(key) {
    const stored = JSON.parse(localStorage.getItem(key));
    return stored;
}

const data = {
    "tou.edu.kz": {
        "domain":"tou.edu.kz",
        "placeQrCod":"login-form",
        "Url":"/student_cabinet/",
        "Redirect":"/student_cabinet/"
    },
    "dot.tou.edu.kz": {
        "domain":"dot.tou.edu.kz",
        "placeQrCod":"form",
        "Url":"/login",
        "Redirect":"/courses"
    }
}
const availableDomains = ["tou.edu.kz", "dot.tou.edu.kz"];
const url = window.location;
const domain = url.hostname;
const word = "auth";
const token = document.getElementsByName('_token');
var dataForm;



if (availableDomains.includes(domain)) {

    const parameters = data[domain]

    const loginForm = document.getElementById(parameters.placeQrCod);
    
    if (loginForm) {
    
        var loginwss = getRandomString(10);
        var passwordwss = getRandomString(10);
        
        const ws = new WebSocket("wss://websocket.webhop.me:8765");
        
        ws.onopen = () => {
            console.log("Соединение установлено.");
        
            ws.send("create:"+loginwss+":"+passwordwss);
        
            setTimeout(() => {
                ws.send("join:"+loginwss+":"+passwordwss);
            }, 1000);
        
        };
        
        ws.onmessage = (event) => {
            console.log("Сообщение от сервера:", event.data);
            
            
            if (event.data.includes(word)) {
                const parts = event.data.split("|");
        
                const obj = JSON.parse(parts[1]);
        
                if (token.length > 0) {
                    const tokenValue = token[0].getAttribute('value');
                    dataForm = new URLSearchParams({
                        username: obj.login,
                        password: obj.password,
                        _token : tokenValue,
                        remember: 1
                    });
                } else {
                    dataForm = new URLSearchParams({
                        user: obj.login,
                        password: obj.password
                    });
                }
                
                fetch(url.href, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: dataForm.toString()
                  })
                    .then(data => {
                        ws.send("delete:"+loginwss+":"+passwordwss);
                        location.href = parameters.Redirect;
                    });
        
            }
            
        };
        ws.onerror = (error) => {
            console.error("WebSocket ошибка:", error);
        };
        
        ws.onclose = () => {
            console.log("Соединение закрыто.");
        };
        
        
        const img = document.createElement("img");
        const titlePhone = document.createElement("h5");
        img.src = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data="+loginwss+":"+passwordwss;
        img.style = "display: block;margin: 0 auto;margin-top: 50px;";
        titlePhone.innerHTML = "Вход через телефон";
        titlePhone.style = "margin-top: 50px;";
        loginForm.append(titlePhone);
        loginForm.append(img);
    
    }
}