class ChatEngine{
    constructor(chatBoxId, userEmail, username){
         this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.username =  username;
        console.log(this.chatBox);
        this.socket = io.connect('http://localhost:5001');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                username: self.username,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            console.log(msg);
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    username: self.username,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message,
                // 'html': '   ',
            }));

            newMessage.append($('<sub>', {
                'html': data.username
            }));

            newMessage.addClass(messageType);

            $('#user-chat-list').append(newMessage);
        })
    }
}