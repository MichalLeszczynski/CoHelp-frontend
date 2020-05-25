function renderRegister() {
    $("#subtitle-box").html("Rejestracja");
    $("#content-box").append($.parseHTML(Mustache.render(registerTemplate, {})));

    $("#toLoginPage").click(
        function() {
            renderClear();
            renderLogin();
        }
    );
    
    // validate
    $("#registerForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            name: "required",
            surname: "required",
            city: "required",
            addressLine: "required",
            postalCode: "required",
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
            name: "Podaj swoje imię",
            surname: "Podaj swoje nazwisko",
            city: "Podaj miasto",
            addressLine: "Podaj ulicę",
            postalCode: "Podaj kod pocztowy",
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
            // get data
            let registerData = $("#registerForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            registerData.accountType = "contractor";
            registerData.phoneNumber = "+48" + registerData.phoneNumber;
            registerData.address = { };
            registerData.address.addressLine = registerData.addressLine;
            registerData.address.postalCode = registerData.postalCode;
            registerData.address.city = registerData.city;
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
                    renderClear();
                    renderLogin();
                    alert("Udało ci się zarejetrować! Użyj swoich danych aby się zalogować.");
                },
                error: function(xhr, status, error) {
                    $("#loginErrorBox").remove();
                    const msg = {
                        id: "loginErrorBox",
                        errorMsg: null
                    }
                    const code = parseInt(xhr.status);
                    if(code == 404) {
                        msg.errorMsg = "Nie udało znaleść podanego adresu!";
                    } else if(code == 403) {
                        msg.errorMsg = "Użytkownik o podanym numerze telefonu już istnieje!";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#registerForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
}