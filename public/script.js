const socket = io("/");

var videoGrid = document.getElementById("video-grid");

var peer = new Peer(undefined,
    {host: '/',port : '3001'})


peer.on('open',id => {
    socket.emit('join-room',ROOM_ID,id);
});

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo,stream);

    peer.on('call',call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',uservideoStream => {
            addVideoStream(video,uservideoStream);
        })
    })

    socket.on('user-connected',userId => {
        connetToNewUser(userId,stream);
    })
})

socket.on('user-disconnected',userId => {
    console.log(userId);
});


function connetToNewUser(userId,stream){
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream',uservideoStream => {
        addVideoStream(video,uservideoStream);
    })
    call.on('close',() => {
        video.remove();
    })
}

function addVideoStream(video,stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play()
    });
    videoGrid.append(video);
}