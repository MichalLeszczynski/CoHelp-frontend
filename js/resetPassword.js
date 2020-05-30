function prepareResetPassword() {
    // validate
    $("#remindForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            phoneNumber: {
                required: true,
                minlength: 9,
                maxlength: 9
            },
        },
        // Specify validation error messages
        messages: {
            phoneNumber: {
                required: "Wpisz swój numer telefonu",
                minlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
                maxlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
            },
        },
        submitHandler: function(form) {
            // get data
            const formData = $("#remindForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
           const phoneNumber = "+48" + formData.phoneNumber;
           
            $("#loginErrorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/RemindPassword" + "?phoneNumber=" + encodeURIComponent(phoneNumber),
                type: "POST",
                contentType: "application/json",
                success: function(data) {
                    alert("Wysłaliśmy hasło na podany numer telefonu!");
                },
                error: function(xhr, status, error) {
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie znaleziono konta z takim numerem telefonu";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#remindForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });

    // validate
    $("#resetForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            phoneNumber: {
                required: true,
                minlength: 9,
                maxlength: 9
            },
            verificationCode: {
                required: true
            },
            newPassword: {
                minlength: 6,
                required: true
            },
        },
        // Specify validation error messages
        messages: {
            phoneNumber: {
                required: "Wpisz swój numer telefonu",
                minlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
                maxlength: "Numer telefonu musi składać się z 9\'ciu cyfr",
            },
            verificationCode: {
                required: "Wpisz kod weryfikacyjny",
            },
            newPassword: {
                required: "Wpisz nowe hasło",
                minlength: "Hasło musi mieć co najmniej 6 znaków"
            },
        },
        submitHandler: function(form) {
            // get data
            const formData = $("#resetForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            formData.phoneNumber = "+48" + formData.phoneNumber;
            
            $("#loginErrorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/ResetPassword" + "?" + jQuery.param(formData),
                type: "POST",
                contentType: "application/json",
                success: function(data) {
                    alert("Hasło zostało pomyślnie zresetowane! Do następnego logowania użyj nowego hasła.");
                    window.location.href = "index.html";
                },
                error: function(xhr, status, error) {
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie znaleziono konta z takim numerem telefonu";
                    } else if(code == 403) {
                        msg.errorMsg = "Kod weryfikacyjny jest niepoprawny";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#resetForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
}