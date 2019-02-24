let uluru, map, marker
let ws
let players = {}
let nick = prompt('Enter your nickname');
let initialDataReceived = false;

function initMap() {
    uluru = { lat: -25.363, lng: 131.044 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: uluru,
        keyboardShortcuts: false
    });
    
    getLocalization()
    startWebSocket()
    addKeyboardEvents()

    document.getElementById('chat-send').addEventListener('click', handleChatSend);
}

function handleChatSend() {
    const message = document.getElementById('chat-input').value;

    ws.send(JSON.stringify({type: 'chat', data: {id: nick, message}}));

    document.getElementById('chat-input').value = '';
}

function addKeyboardEvents() {
    window.addEventListener('keydown', poruszMarkerem)
}
function poruszMarkerem(ev) {
    let lat = marker.getPosition().lat()
    let lng = marker.getPosition().lng()

    switch (ev.code) {
        case 'ArrowUp':
            lat += 0.1
            break;
        case 'ArrowDown':
            lat -= 0.1
            break;
        case 'ArrowLeft':
            lng -= 0.1
            break;
        case 'ArrowRight':
            lng += 0.1
            break;
    }
    let position = {
        lat,
        lng
    }
    let wsData = {
        lat: lat,
        lng: lng,
        id: nick
    }
    marker.setPosition(position)
    ws.send(JSON.stringify(wsData))
}
function startWebSocket() {
    let url = 'ws://localhost:8080'
    ws = new WebSocket(url)
    ws.addEventListener('open', onWSOpen)
    ws.addEventListener('message', onWSMessage)
}

function renderChat(chatLog) {
    const chatNode = document.getElementById('chat');
    chatNode.innerHTML = '';

    chatLog.forEach((logEntry) => {
        const chatEntry = document.createElement('div');
        chatEntry.innerHTML = `<span style="font-weight: bold; color: blue;">${logEntry.id}</span>: ${logEntry.message}`;
        chatNode.appendChild(chatEntry);
    });
}

function onWSOpen(data) {
    console.log(data)
}
function onWSMessage(e) {
    let serverData = JSON.parse(e.data)

    if (serverData.type === 'chat') {
        renderChat(serverData.chatLog);
    }

    if (serverData.type === 'players') {
        if (!initialDataReceived) {
            initialDataReceived = true;
            
            marker = new google.maps.Marker({
                position: uluru,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'https://cdn0.iconfinder.com/data/icons/hamburg/32/user.png'
            });
    
            const currentUser = serverData.players.find(entry => entry.id === nick);
    
            if (currentUser) {
                marker.setPosition({
                    lat: currentUser.lat,
                    lng: currentUser.lng,
                });
            } else {
                navigator.geolocation.getCurrentPosition(function(geoData) {
                    let coords = {
                        lat: geoData.coords.latitude,
                        lng: geoData.coords.longitude
                    }
                    marker.setPosition(coords)
                }, geoFail);
            }
        }
    
        serverData.players.filter(entry => entry.id !== nick).forEach((entry) => {
            if (!players['user' + entry.id]) {
                players['user' + entry.id] = new google.maps.Marker({
                    position: { lat: entry.lat, lng: entry.lng },
                    map: map,
                    animation: google.maps.Animation.DROP
                })
            } else {
                players['user' + entry.id].setPosition({
                    lat: entry.lat,
                    lng: entry.lng
                })
            }
        });
    }
}



function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)

}

function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    map.setCenter(coords)
}

function geoFail(err) {
    console.log(err)
}
