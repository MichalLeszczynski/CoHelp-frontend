const user = {
    accountType: null,
    authToken: null,
    userId: null,
    phoneNumber: null,
    password: null,
}

const orders = {
    accepted: null,
    finished: null,
    available: null
}

let loginTemplate = null;
let entryTemplate = null;
let mainPanelTemplate = null;
let registerTemplate = null;
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

function renderClear() {
    $("#content-box").children().remove();
}