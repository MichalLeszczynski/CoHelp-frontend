function remapProducts(orderArray) {

    for (const item of orderArray) {
        const productDict = item.products;
        output = [];
        Object.keys(productDict).forEach(function (key) {
            output.push({
                name: key,
                amount: productDict[key]
            });
        });
        item.products = output;
    }
    return orderArray;
}

function perpareForms() {
    // password change
    $("#changePasswordForm").submit(function (e) { e.preventDefault(); }).validate({
        rules: {
            currentPassword: {
                required: true,
            },
            newPassword: {
                required: true,
                minlength: 6
            },
        },
        // Specify validation error messages
        messages: {
            currentPassword: {
                required: "Wpisz obecne hasło",
            },
            newPassword: {
                required: "Wpisz nowe hasło",
                minlength: "Hasło musi mieć co najmniej 6 znaków"
            },
        },
        submitHandler: function (form) {
            formData = $("#changePasswordForm").serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            formData.userId = user.userId;

            $("#errorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/ChangePassword" + "?" + jQuery.param(formData),
                type: "POST",
                success: function (data) {
                    console.log(data);
                    $("#changePasswordDailog").dialog("close");
                    alert("Twoje hasło zostało zmienione! Przy następnym logowaniu użyj nowego hasła.");
                },
                error: function (xhr, status, error) {
                    const msg = {
                        id: "errorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if (code == 403) {
                        msg.errorMsg = "Podane obecne hasło nie jest prawidłowe";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#changePasswordForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });

    // adress change
    $("#changeAdressForm").submit(function (e) { e.preventDefault(); }).validate({
        rules: {
            city: {
                required: true,
            },
            addressLine: {
                required: true,
            },
            postalCode: {
                required: true,
            },
        },
        // Specify validation error messages
        messages: {
            city: {
                required: "Wpisz nazwę miasta!",
            },
            addressLine: {
                required: "Wpisz nazwę ulicy oraz numer mieszkania!",
            },
            postalCode: {
                required: "Wpisz swój kod pocztowy",
            },
        },
        submitHandler: function (form) {
            formData = $("#changeAdressForm").serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            idData = {
                "userId": user.userId,
            };

            console.log(formData);
            $("#errorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/ChangeAddress" + "?" + jQuery.param(idData),
                type: "POST",
                data: JSON.stringify(formData),
                contentType: "application/json",
                success: function (data) {
                    sessionStorage.setItem('addressLine', formData.addressLine);
                    sessionStorage.setItem('city', formData.city);
                    sessionStorage.setItem('postalCode', formData.postalCode);
                    $("#changeAdressDailog").dialog("close");
                    window.location.href = "app.html";
                },
                error: function (xhr, status, error) {
                    const msg = {
                        id: "errorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if (code == 403) {
                        msg.errorMsg = "Nie znaleziono podanego adresu!";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#changeAdressForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
}