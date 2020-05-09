const user = {
    accountType: null,
    authToken: null,
    userId: null
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
$.get('templates/login.mst', function(data) {
    loginTemplate = data;
    renderLogin();
});

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


// Views
function renderClear() {
    $("#content-box").children().remove();
}

function renderLogin() {
    let output = Mustache.render(loginTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);

    $("#registerLink").click(
        function() {
            renderClear();
            renderRegister();
        }
    );

    $("#loginButton").click(
        function() {
            loginData = $("#loginForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            loginData.phoneNumber = "+48" + loginData.phoneNumber;

            console.log(loginData);
            $.ajax({
                url: serverURL + "/api/Auth/Login" + "?" + jQuery.param(loginData),
                type: "POST",
                success: function(data) {
                    user.accountType = data.accountType;
                    user.authToken = data.authToken;
                    user.userId = data.userId;
                    renderClear();
                    renderMainPanel();
                },
                error: function(xhr, status, error) {
                    $("#loginErrorBox").remove();
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie znaleziono takiego użytkownika :(";
                    } else if(code == 401) {
                        msg.errorMsg = "Użytkownik niezweryfikowany";
                    } else if(code == 403) {
                        msg.errorMsg = "Niepoprawne hasło";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code;
                    }
                    let output = Mustache.render(errorTemplate, msg);
                    output = $.parseHTML(output);
                    $("#loginForm").prepend(output);
                }
            });
        }
    );
}

function renderRegister() {
    let output = Mustache.render(registerTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);

    $("#toLoginPage").click(
        function() {
            renderClear();
            renderLogin();
        }
    );

    $("#registerButton").click(
        function() {
            registerData = $("#registerForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            registerData.phoneNumber = "+48" + registerData.phoneNumber;
            registerData.address = { };
            registerData.address.addressLine = registerData.addressLine;
            registerData.address.postalCode = registerData.postalCode;
            registerData.address.city = registerData.city;
            delete registerData.addressLine;
            delete registerData.postalCode;
            delete registerData.city;
            console.log(registerData);

            $.ajax({
                url: serverURL + "/api/Auth/Register",
                type: "POST",
                data: JSON.stringify(registerData),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                    renderClear();
                    renderLogin();
                    alert("Użytkownik zarejestrowany pomyślnie");
                },
                error: function(xhr, status, error) {
                    $("#loginErrorBox").remove();
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie znaleziono takiego użytkownika :(";
                    } else if(code == 401) {
                        msg.errorMsg = "Użytkownik niezweryfikowany";
                    } else if(code == 403) {
                        msg.errorMsg = "Niepoprawne hasło";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code;
                    }
                    let output = Mustache.render(errorTemplate, msg);
                    output = $.parseHTML(output);
                    $("#registerForm").prepend(output);
                }
            });
        }
    );
}

function renderMainPanel() {
    let output = Mustache.render(mainPanelTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);

    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAcceptedOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.accepted = data; }
    });

    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorFinishedOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.finished = data; }
    });

    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAvailableOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.available = data; }
    });

    console.log(orders);

    // $("#loginbutton").click(
    //     function() {
    //         loginData = $("#loginform").serializeArray().reduce(function(obj, item) {
    //             obj[item.name] = item.value;
    //             return obj;
    //         }, {});
    //         console.log(loginData);
    //     }
    // );
}
