function renderAuthorize() {
    $("#title-box").html("Autoryzacja");
    $("#content-box").append($.parseHTML(Mustache.render(authorizeTemplate, {})));

    // validate
    $("#authorizeForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            verificationCode: {
                required: true,
                minlength: 4,
            },
        },
        // Specify validation error messages
        messages: {
            verificationCode: {
                required: "Wpisz kod wysłany SMS\'em",
                minlength: "Kod składa się z co najmniej 4 znaków",
            },
        },
        submitHandler: function(form) {
            authorizeData = $("#authorizeForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            authorizeData.userId = user.userId;

            console.log(authorizeData);
            $.ajax({
                url: serverURL + "/api/Auth/Authorize" + "?" + jQuery.param(authorizeData),
                type: "POST",
                success: function(data) {
                    let loginData = {};
                    loginData.phoneNumber = user.phoneNumber;
                    loginData.password = user.password;
                    $.ajax({
                        url: serverURL + "/api/Auth/Login" + "?" + jQuery.param(loginData),
                        type: "POST",
                        success: function(data) {
                            alert("Pomyślnie potwierdzono twoją tożsamość, zaloguj się ponownie aby zacząć w pełni kożystać z serwisu! :-)");
                            renderClear();
                            renderLogin();
                        },
                        error: function(xhr, status, error) {
                            renderClear();
                            renderLogin();
                        }
                    });
                },
                error: function(xhr, status, error) {
                    $("#loginErrorBox").remove();
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 403) {
                        msg.errorMsg = "Niepoprawny kod weryfikacyjny!";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#authorizeForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
    
}