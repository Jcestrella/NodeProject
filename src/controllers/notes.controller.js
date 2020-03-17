const notesCtrl = {};
const Note = require('../models/Note');
const { unlink } = require('fs-extra');
const path = require('path');
const faker = require('faker');

const comparar = (valor) =>{
    if(valor == 1){
        return true;
    }else{
        return false;
    }
}

const pages = (valor, pages) =>{
    let variable;
    if (valor > 5){
        variable = valor - 4;
    }else{
        variable = 1;
    }
    for(variable; variable <= valor + 4 && variable <= pages; i++){
        if(variable == valor){
            return variable;
        }else{
            return variable;
        }
    }
}

notesCtrl.renderNoteForm = (req, res) => {
    res.render('notes/new-note')
};

notesCtrl.createNewNote = async (req, res) => {
    const { title, description } = req.body;
    const image = '/img/uploads/' + req.file.filename;
    const newNote = new Note({ title, description, image });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes');
};

notesCtrl.renderNotes = async (req, res) => {
    const notes = await Note.find({user: req.user.id});
    res.render('notes/all-notes', { notes })
}

notesCtrl.renderEditForm = async (req, res) => {
    const note = await Note.findById(req.params.id);
    if(note.user != req.user.id){
        req.flash('error_msg', 'Not authorized');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', { note })
};

notesCtrl.updateNote = async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
};

notesCtrl.deleteNote = async (req, res) => {
    const object = await Note.findByIdAndDelete(req.params.id);
    await unlink(path.join(__dirname, '../public' + object.image));
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
};

notesCtrl.addFakeNote = (req, res) => {
    for(let i =0; i < 90; i++){
        const fakeNote = new Note();
        fakeNote.title = faker.name.title();
        fakeNote.description = faker.lorem.text(5);
        fakeNote.image = faker.image.image();
        fakeNote.user = '5e5f688ef6199d278c86454d';
        fakeNote.save();
    }
    res.redirect('/users/signin');
}

notesCtrl.pagination = (req, res, next) => {
    let perPage = 9;
    let page = req.params.page || 1;

    Note
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, notes) => {
            Note.count((err, count) => {
                if(err){
                    return next(err)
                }else {
                    res.render('notes/pages', {
                        notes,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        condition: comparar(page),
                        conditionLast: comparar(Math.ceil(count/perPage))
                    });
                }
            });
        })
}

module.exports = notesCtrl;