function renderLogin() {
    $("#subtitle-box").html("Logowanie");
    let output = Mustache.render(loginTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);

    $("#registerLink").click(
        function() {
            renderClear();
            renderRegister();
        }
    );
    
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
                minlength: 4
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
                minlength: "Hasło musi mieć co najmniej 4 znaki"
            },
        },
        submitHandler: function(form) {
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
                    renderContractorPanel();
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
                        console.log(xhr.responseText);
                    } else if(code == 403) {
                        msg.errorMsg = "Niepoprawne hasło";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    let output = Mustache.render(errorTemplate, msg);
                    output = $.parseHTML(output);
                    $("#loginForm").prepend(output);
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