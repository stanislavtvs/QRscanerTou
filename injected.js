function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


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
    const str = "Привет, это пример строки";
    const word = "auth";
    
    if (event.data.includes(word)) {
        const parts = event.data.split("|");

        const obj = JSON.parse(parts[1]);

        const data = new URLSearchParams({
            user: obj.login,
            password: obj.password
          });
        
        fetch('/student_cabinet/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString()
          })
            .then(data => {
                ws.send("delete:"+loginwss+":"+passwordwss);
                location.reload();
            });

    } else {
      console.log("Слово отсутствует.");
    }
    
};
ws.onerror = (error) => {
    console.error("WebSocket ошибка:", error);
};

ws.onclose = () => {
    console.log("Соединение закрыто.");
};

const loginForm = document.getElementById("login-form");
const img = document.createElement("img");
const titlePhone = document.createElement("h5");
img.src = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data="+loginwss+":"+passwordwss;
img.style = "display: block;margin: 0 auto;margin-top: 50px;";
titlePhone.innerHTML = "Вход через телефон";
titlePhone.style = "margin-top: 50px;";
loginForm.append(titlePhone);
loginForm.append(img);