const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose'); // requiring mongoose package
const { ObjectId } = require('mongodb'); // object id to use in syntax (_id: ObjectId)
const methodOverride = require('method-override'); // will be used to send patch, put and delete request as it is not possible in normal apis

app.use(express.static(path.join(__dirname, 'public'))); // public directory can be used to make css type files
app.use(express.urlencoded({extended: true})); // to decode a req.body;

app.set('views', path.join(__dirname, 'views')); // we will be using views folder to have the ejs files
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));

main() // main will try to make connection with database in below block 0.1
    .then((res) => {
        console.log('Connection Successful');
    })
    .catch((err) => {
        console.log(err);
    });

    // block 0.1 - will try to connect with the dadabase named 'userchat'
    // whatever is written after local host wll be the name of our database in this case its userchat
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userchat');
};


// REQUIRED: this block is required here ( if you are confused with the init.js file )
const chatSchema = mongoose.Schema({ // creating a schema named chatSchema using mongoose
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

// REQUIRED: this block is required here ( if you are confused with the init.js file )
const Chat = mongoose.model('Chat', chatSchema); // creating a model named Chat which will use chatSchema for constraints
// the model name will be the name of our database collection but in plural form, ie. here it will be 'chats'

// Root route - homr route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

// Show Chats route
app.get('/chats', async (req, res) => { // will get chats route and render the file chats.ejs with chats variable which is having our chat details
    let chats = await Chat.find(); // this function print whole collection
    res.render('chats.ejs', {chats});
});

// New Chat route - will be used to serve the form to create new chats
app.get('/chats/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/chats', (req, res) => {
    let {from, to, msg} = req.body; // will extract the info from req.body to create a new chat
    let newChat = new Chat({ // creating a new chat - or you can say assigning the info to our schema
        from: from,
        to: to,
        msg: msg,
        created_at: new Date, // new Date is used to assign the date and time the chat was created
    });
    // console.log(newChat);
    newChat.save() // will save our new chat in the collection named as specified in the schema while assigning the values, in above case ( line: 69 ) its 'Chat'
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect('/chats'); // will direct us on the /chats page
});

// Detail chat route
app.get('/chats/:id', async (req, res) => {
    let { id } = req.params;
    let detailedChat = await Chat.findById(id);
    res.render('detail.ejs', { detailedChat });
})

// Edit route - will be used to serve the edit form
app.post('/chats/:id/edit', async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render('edit.ejs', {chat});
});

// update route - updating the msg
app.put('/chats/:id', async (req, res) => {
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators: true, new: true});
    console.log(updateChat);
    res.redirect('/chats');
});

// Delete Route
app.delete('/chats/:id', async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect('/chats');
});

app.listen(port, () => { // listen function for to listen the requests
    console.log(`app is listening at ${port}`);
});