const serverURL = "http://185.238.75.42:16010";

function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

function renderClear() {
    $("#content-box, #content-box *").unbind();
    $("#content-box").children().remove();
}

// universal templates
let errorTemplate = null;


$.ajax({
    url: 'templates/error.mst',
    async: false,
    success: function (data) {
        errorTemplate = data;
    }
});