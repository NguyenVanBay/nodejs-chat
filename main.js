function openStream() {
    const config = {audio: true, video : true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
};

const peer = new Peer();

peer.on('open', id => {

    $('#dang-ki').click(() => {

        var user_name = $('#username').val();
    
        socket.emit('client-dang-ki', {user: user_name, peer: id});
    });
});

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

const socket = io('https://baykaptit0rtc.herokuapp.com/');

$('#form-chat').hide();


socket.on('dang-ki-thanh-cong', (data) => {
    $('#form-chat').show();
    $('#form-dang-ki').hide();

    
    $('#ten-thanh-vien').html(data.user);
});

socket.on('co-nguoi-moi-dang-ki', (data) => {

    $('#ds-thanh-vien').html('');
    data.forEach(value => {
        $('#ds-thanh-vien').append('<li id='+ value.peer +'>' + value.user + '</li>');
    });
});

socket.on('dang-ki-that-bai', (data) => {
    alert(data);
});

$('#ds-thanh-vien').on('click', 'li', function() {
    
    id = $(this).attr('id');

    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
});

socket.on('co-nguoi-ngat-ket-noi', (data) => {
    $(`#${data}`).remove();
});