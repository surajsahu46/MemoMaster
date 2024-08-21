var notesWrapper = document.getElementById("notes-wrapper");
var title = document.getElementById("title");
var content = document.getElementById("content");
var error = document.getElementById("form-error");
var search = document.getElementById("search");
var category = document.getElementById("category");
var priority = document.getElementById("priority");
var darkModeToggle = document.getElementById("dark-mode-toggle");

let notesArray = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
localStorage.setItem('notes', JSON.stringify(notesArray));
const data = JSON.parse(localStorage.getItem('notes'));

data.forEach(note => {
    createNote(note.title, note.text, note.date, note.category, note.priority);
});

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function searchNotes() {
    const query = search.value.toLowerCase();
    const notes = document.getElementsByClassName('note');
    Array.from(notes).forEach(note => {
        const title = note.querySelector('.note-title').innerText.toLowerCase();
        const text = note.querySelector('.note-text').innerText.toLowerCase();
        note.style.display = title.includes(query) || text.includes(query) ? 'block' : 'none';
    });
}

search.addEventListener('input', debounce(searchNotes, 300));

function createNote(title, text, date, category, priority) {
    var noteTitle = document.createElement("div");
    noteTitle.className = "note-title";
    noteTitle.innerHTML = title;

    var noteEdit = document.createElement("span");
    noteEdit.className = "note-edit";
    noteEdit.innerHTML = "Edit";
    noteEdit.setAttribute("onclick", `editNote(${document.getElementsByClassName("note").length})`);

    var noteSave = document.createElement("span");
    noteSave.className = "note-save";
    noteSave.innerHTML = "Save";
    noteSave.setAttribute("disabled", "true");
    noteSave.setAttribute("onclick", `saveNote(${document.getElementsByClassName("note").length})`);

    var noteExpand = document.createElement("span");
    noteExpand.className = "note-expand";
    noteExpand.innerHTML = "Expand";
    noteExpand.setAttribute("onclick", `expandNote(${document.getElementsByClassName("note").length})`);

    var noteDelete = document.createElement("span");
    noteDelete.className = "note-delete";
    noteDelete.innerHTML = "Delete";
    noteDelete.setAttribute("onclick", `deleteNote(${document.getElementsByClassName("note").length})`);

    var noteControls = document.createElement("div");
    noteControls.className = "note-controls";
    noteControls.append(noteExpand, noteEdit, noteSave, noteDelete);

    var noteText = document.createElement("div");
    noteText.className = "note-text";
    noteText.innerHTML = text;

    var noteDate = document.createElement("div");
    noteDate.className = "note-date";
    noteDate.innerHTML = date;

    var noteCategory = document.createElement("div");
    noteCategory.className = "note-category";
    noteCategory.innerHTML = category;

    var notePriority = document.createElement("div");
    notePriority.className = "note-priority";
    notePriority.innerHTML = priority;

    var note = document.createElement("div");
    note.className = "note";
    note.append(noteTitle, noteControls, noteText, noteDate, noteCategory, notePriority);
    note.id = "note" + document.getElementsByClassName("note").length;

    notesWrapper.insertBefore(note, notesWrapper.firstChild);
}

function addNote() {
    if (content.value.trim() === "") {
        error.innerHTML = "Note cannot be empty";
    } else {
        var options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        var noteContainer = {
            title: title.value,
            text: content.value,
            date: new Date().toLocaleString('en-US', options),
            category: category.value,
            priority: priority.value
        };
        notesArray.push(noteContainer);
        localStorage.setItem("notes", JSON.stringify(notesArray));
        createNote(noteContainer.title, noteContainer.text, noteContainer.date, noteContainer.category, noteContainer.priority);
        error.innerHTML = "";
        content.value = "";
        title.value = "";
        category.value = "";
        priority.value = "low";
    }
}

function deleteNote(index) {
    var del = confirm("Are you sure you want to delete this note?");
    if (del) {
        var note = document.getElementById(`note${index}`);
        note.parentNode.removeChild(note);
        notesArray.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notesArray));
        location.reload();
    }
}

function editNote(index) {
    var note = document.getElementById(`note${index}`);
    var noteTitle = note.getElementsByClassName("note-title")[0];
    var noteText = note.getElementsByClassName("note-text")[0];
    var noteSave = note.getElementsByClassName("note-save")[0];
    noteTitle.contentEditable = "true";
    noteText.contentEditable = "true";
    noteSave.setAttribute("disabled", "false");
    noteTitle.focus();
    expandNote(index);
}

function saveNote(index) {
    var note = document.getElementById(`note${index}`);
    var noteTitle = note.getElementsByClassName("note-title")[0];
    var noteText = note.getElementsByClassName("note-text")[0];
    var noteSave = note.getElementsByClassName("note-save")[0];
    if (noteText.innerHTML.trim() === "") {
        error.innerHTML = "Cannot save empty note";
    } else {
        notesArray[index].title = noteTitle.innerHTML;
        notesArray[index].text = noteText.innerHTML;
        noteTitle.contentEditable = "false";
        noteText.contentEditable = "false";
        localStorage.setItem("notes", JSON.stringify(notesArray));
        error.innerHTML = "";
        noteSave.setAttribute("disabled", "true");
        shrinkNote(index);
    }
}

function expandNote(index) {
    var note = document.getElementById(`note${index}`);
    var noteText = note.getElementsByClassName("note-text")[0];
    var noteExpand = note.getElementsByClassName("note-expand")[0];
    noteText.style.maxHeight = "fit-content";
    noteExpand.innerHTML = "Minimize";
    noteExpand.setAttribute("onclick", `shrinkNote(${index})`);
}

function shrinkNote(index) {
    var note = document.getElementById(`note${index}`);
    var noteText = note.getElementsByClassName("note-text")[0];
    var noteExpand = note.getElementsByClassName("note-expand")[0];
    noteText.style.maxHeight = "10vh";
    noteExpand.innerHTML = "Expand";
    noteExpand.setAttribute("onclick", `expandNote(${index})`);
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Autosave
setInterval(() => {
    localStorage.setItem('notes', JSON.stringify(notesArray));
}, 30000); // Autosave every 30 seconds

// Share Note
function shareNote() {
    const subject = encodeURIComponent('Check out this note');
    const body = encodeURIComponent(`Title: ${title.value}\nContent: ${content.value}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
