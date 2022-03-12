var io = require('socket.io')(process.env.PORT || 3000);

var infomation_client = [];

io.on('connection', socket => {

    console.log('conguoiketnoi');
    
    socket.on('client-dang-ki', data => {

        if(infomation_client.findIndex(x => x.user === data.user) > -1) {
            socket.emit('dang-ki-that-bai', 'Đăng kí thất bại. user name đã được sử dụng !');
            console.log('đk thất bại');
            
        } else {
            infomation_client.push(data);
            socket.peerID = data.peer;
            socket.emit('dang-ki-thanh-cong', data);
            io.sockets.emit('co-nguoi-moi-dang-ki', infomation_client);
            console.log('đang ki thanh cong');
        }

        socket.on('disconnect', () => {
            const index = infomation_client.findIndex(x => x.peer === socket.peerID);
            infomation_client.splice(index, 1);
            io.sockets.emit('co-nguoi-ngat-ket-noi', socket.peerID);
        });
    });

    
});
