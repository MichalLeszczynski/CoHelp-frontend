const user = {
    accountType: null,
    authToken: null,
    userId: null,
    phoneNumber: null,
    password: null,
    adress: null,
    name: null,
    surname: null
}

let registerTemplate = null;
let loginTemplate = null;
let entryTemplate = null;
let mainPanelTemplate = null;
let authorizeTemplate = null;
let errorTemplate = null;
let remindPasswordTemplate = null;
let dialogTemplate = null;

const serverURL = "http://185.238.75.42:16010";

// Get templates with get
$.get('templates/register.mst', function(data) {
    registerTemplate = data;
});

$.get('templates/entry.mst', function(data) {
    entryTemplate = data;
});

$.get('templates/mainPanel.mst', function(data) {
    mainPanelTemplate = data;
});

$.get('templates/error.mst', function(data) {
    errorTemplate = data;
});

$.get('templates/authorize.mst', function(data) {
    authorizeTemplate = data;
});

$.get('templates/remindPassword.mst', function(data) {
    remindPasswordTemplate = data;
});

$.get('templates/dialog.mst', function(data) {
    remindPasswordTemplate = data;
});

function renderClear() {
    $("#content-box").children().remove();
}