const peerConnection = new RTCPeerConnection();
const dataChannel = peerConnection.createDataChannel('chat');

dataChannel.onopen = () => {
  console.log('DataChannel открыт!');
  dataChannel.send('Привет от Клиента 1!');
};

dataChannel.onmessage = (event) => {
  console.log('Сообщение от Клиента 2:', event.data);
};

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    console.log('ICE-кандидат для Клиента 2:', JSON.stringify(event.candidate));
  }
};

// Создание SDP-предложения
peerConnection.createOffer()
  .then(offer => peerConnection.setLocalDescription(offer))
  .then(() => {
    console.log('SDP-предложение для Клиента 2:', JSON.stringify(peerConnection.localDescription));
  });

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => {
        console.log('Ответ от Клиента 2 установлен!');
      })
      .catch(error => {
        console.error('Ошибка установки ответа:', error);
      });
  }

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .then(() => console.log('ICE-кандидат добавлен!'))
      .catch(error => console.error('Ошибка добавления ICE-кандидата:', error));
}
  