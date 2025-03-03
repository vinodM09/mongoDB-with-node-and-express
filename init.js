// this is just a initialization file to init the db, just for to have something to work on
// no connection with the original index.js file, it is just to init the db


const mongoose = require('mongoose');

main()
    .then((res) => {
        console.log('Connection Successful');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userchat');
};

const chatSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        maxLength: 100
    },
    created_at: {
        type: Date,
    }
});

const Chat = mongoose.model('Chat', chatSchema);

chats = [
    {
        from: 'Vijay',
        to: 'Ajay',
        msg: 'Hey, I went to college today.',
        created_at: new Date()
    },
    {
        from: 'Mukesh',
        to: 'Suressh',
        msg: 'bro please.',
        created_at: new Date()
    },
    {
        from: 'Ram',
        to: 'Shyam',
        msg: 'please feed the cows',
        created_at: new Date()
    },
    {
        from: 'Nagesh',
        to: 'Vinod',
        msg: 'did you see it',
        created_at: new Date()
    },
    {
        from: 'Vivek',
        to: 'Ujjwal',
        msg: 'kya kar raha bhai',
        created_at: new Date()
    }
];

Chat.insertMany(chats); // inserting the cahts in the collection