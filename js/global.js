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
let authorizeTemplate = null;
let entryTemplate = null;
let mainPanelTemplate = null;
let errorTemplate = null;

const serverURL = "http://185.238.75.42:6010";

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

function renderClear() {
    $("#content-box").children().remove();
}