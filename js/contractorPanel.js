const panelData = {
    available: null,
    finished: null,
    accepted: null,
    name: null,
    surname: null
};

function getOrderData() {

    function remapProducts(orderArray) {

        for(const item of orderArray) {
            const productDict = item.products;
            output = [];
            Object.keys(productDict).forEach(function(key) {
                output.push({
                    name: key,
                    amount: productDict[key]
                });
            });
            item.products = output;
        }
        return orderArray;
    }

    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAcceptedOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) {
            panelData.accepted = remapProducts(data);
        }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorFinishedOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) {
            panelData.finished = remapProducts(data);
        }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAvailableOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) {
            console.log(data);
            panelData.available = remapProducts(data);
        }
    });
    console.log(panelData);
}

function perpareForms() {
    // password change
    $("#changePasswordForm").submit(function(e) { e.preventDefault(); }).validate({
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
        submitHandler: function(form) {
            formData = $("#changePasswordForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            formData.userId = user.userId;
            
            console.log(loginData);
            $("#errorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/ChangePassword" + "?" + jQuery.param(formData),
                type: "POST",
                success: function(data) {
                    console.log(data);
                    $("#changePasswordDailog").dialog("close");
                    alert("Twoje hasło zostało zmienione! Przy następnym logowaniu użyj nowego hasła.");
                },
                error: function(xhr, status, error) {
                    const msg = {
                        id: "errorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if(code == 403) {
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
    $("#changeAdressForm").submit(function(e) { e.preventDefault(); }).validate({
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
        submitHandler: function(form) {
            formData = $("#changeAdressForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            idData = {
                "userId": user.userId,
            };

            console.log(loginData);
            $("#errorBox").remove();
            $.ajax({
                url: serverURL + "/api/AccountSettings/ChangeAddress" + "?" + jQuery.param(idData),
                type: "POST",
                data: JSON.stringify(formData),
                contentType: "application/json",
                success: function(data) {
                    user.address.city = formData.city;
                    user.address.addressLine = formData.addressLine;
                    user.address.postalCode = formData.postalCode;
                    $("#changeAdressDailog").dialog("close");
                    renderClear();
                    renderContractorPanel();
                },
                error: function(xhr, status, error) {
                    const msg = {
                        id: "errorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if(code == 403) {
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

function renderContractorPanel() {
    console.log(user);
    panelData.name = user.name;
    panelData.surname = user.surname;
    panelData.city = user.address.city;
    panelData.addressLine = user.address.addressLine;
    panelData.postalCode = user.address.postalCode;
    $("#subtitle-box").html("Panel pomocnika");

    getOrderData();

    $("#content-box").append($.parseHTML(Mustache.render(mainPanelTemplate, panelData)));

    perpareForms();
    
    // initialize panels
    for(var item of panelData.available) {
        const id = "#panel-" + item.id;
        $(id).dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    }

    for(var item of panelData.finished) {
        const id = "#panel-" + item.id;
        $(id).dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    }

    for(var item of panelData.accepted) {
        const id = "#panel-" + item.id;
        $(id).dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    }

    // prepare buttons
    $(".entry-button").click(function() {
        const button = $(this);
        const id = "#panel-" + button.val();
        $(id).dialog("open");
    });


    $("#changePasswordDailog").dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    $("#changePasswordButton").click(function() {
        $("#changePasswordDailog").dialog("open");
    });

    $("#changeAdressDailog").dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    $("#changeAdressButton").click(function() {
        $("#changeAdressDailog").dialog("open");
    });

    $("#opener").click(function() {
        $("#dialog").dialog("open");
    });
}