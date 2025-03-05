const yargs = require('yargs');
const fs = require('fs');

yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string',
        },
    },
    handler: function (argv){
        const notes = loadNotes();
        const newNote = {
            title: argv.title,
            body: argv.body,
        };
        notes.push(newNote);
        saveNotes(notes);
        console.log('Note added:', argv.title);
    },
});

yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder:{
        title: {
            describe: 'Note title to remove',
            demandOption: true,
            type: 'string',
        },
    },
    handler: function (argv){
        const notes = loadNotes();
        const notesToKeep = notes.filter(note => note.title !== argv.title);
        saveNotes(notesToKeep);
        console.log(argv.title ? 'Note removed!' : 'Note not found!');
    },
});


yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Note title to read',
            demandOption: true,
            type: 'string',
        },
    },
    handler: function (argv){
        const notes = loadNotes();
        const note = notes.find(note => note.title === argv.title);
        if(note){
            console.log(`Title: ${note.title}`);
            console.log(`Body: ${note.body}`);
        } else {
            console.log('Note not found!');          
        }
    },
});

const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        console.log("Loaded notes:", dataJSON); 
        return JSON.parse(dataJSON);
    } catch(e){
        console.log('Error loading notes:', e); 
        return [];
    }
}


const saveNotes = notes => {
    const dataJSON = JSON.stringify(notes);
    console.log("Saving notes:", dataJSON);
    fs.writeFileSync('notes.json', dataJSON);
};

yargs.parse();