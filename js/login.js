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

// templates
let loginTemplate = null;
let authorizeTemplate = null;

$.get('templates/authorize.mst', function(data) {
    authorizeTemplate = data;
});

function renderLogin() {
    $("#content-box").append($.parseHTML(Mustache.render(loginTemplate, {})));
    $("#title-box").html("Strona Logowania");
    
    // validate
    $("#loginForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            phoneNumber: {
                required: true,
                minlength: 9,
                maxlength: 9
            },
            password: {
                required: true,
                minlength: 6
            },
        },
        // Specify validation error messages
        messages: {
            phoneNumber: {
                required: "Wpisz swój numer telefonu",
                minlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
                maxlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
            },
            password: {
                required: "Wpisz hasło",
                minlength: "Hasło musi mieć co najmniej 6 znaków"
            },
        },
        submitHandler: function(form) {
            loginData = $("#loginForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            loginData.phoneNumber = "+48" + loginData.phoneNumber;
            user.phoneNumber = loginData.phoneNumber;
            user.password = loginData.password;

            console.log(loginData);
            $("#loginErrorBox").remove();
            $.ajax({
                url: serverURL + "/api/Auth/Login" + "?" + jQuery.param(loginData),
                type: "POST",
                success: function(data) {
                    // Set session data
                    sessionStorage.setItem('accountType', data.accountType.toLowerCase());
                    sessionStorage.setItem('authToken', data.authToken);
                    sessionStorage.setItem('userId', data.userId);
                    sessionStorage.setItem('name', data.name);
                    sessionStorage.setItem('surname', data.surname);
                    sessionStorage.setItem('addressLine', data.address.addressLine);
                    sessionStorage.setItem('city', data.address.city);
                    sessionStorage.setItem('postalCode', data.address.postalCode);
                    console.log(data);
                    window.location.href = "app.html";
                },
                error: function(xhr, status, error) {
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie znaleziono takiego użytkownika :(";
                    } else if(code == 401) {
                        user.userId = JSON.parse(xhr.responseText).userId;
                        renderClear();
                        renderAuthorize();
                    } else if(code == 403) {
                        msg.errorMsg = "Niepoprawne hasło";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#loginForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
    
}
    
// initalize
$.get('templates/login.mst', function(data) {
    loginTemplate = data;
    renderLogin();
});