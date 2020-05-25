const panelData = {
    accepted: null,
    finished: null,
    available: null,
    name: null,
    surname: null
};

function getOrderData() {
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAcceptedOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { panelData.accepted = data; }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorFinishedOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { panelData.finished = data; }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAvailableOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { panelData.available = data; }
    });
    console.log(panelData);
}

function perpareForms() {
    $("#changePasswordForm").submit(function(e) { e.preventDefault(); }).validate({
        rules: {
            currentPassword: {
                required: true,
            },
            newPassword: {
                required: true,
                minlength: 4
            },
        },
        // Specify validation error messages
        messages: {
            currentPassword: {
                required: "Wpisz obecne hasło",
            },
            newPassword: {
                required: "Wpisz nowe hasło",
                minlength: "Hasło musi mieć co najmniej 4 znaki"
            },
        },
        submitHandler: function(form) {
            formData = $("#changePasswordForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            formData.userId = user.userId;

            console.log(loginData);
            $.ajax({
                url: serverURL + "/api/AccountSettings/ChangePassword" + "?" + jQuery.param(formData),
                type: "POST",
                success: function(data) {
                    console.log(data);
                    $("#changePasswordDailog").dialog("close");
                    alert("Twoje hasło zostało zmienione! Przy następnym logowaniu użyj nowego hasła.");
                },
                error: function(xhr, status, error) {
                    $("#errorBox").remove();
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
}

function renderContractorPanel() {
    panelData.name = user.name;
    panelData.surname = user.surname;
    $("#subtitle-box").html("Panel pomocnika");

    getOrderData();

    $("#content-box").append($.parseHTML(Mustache.render(mainPanelTemplate, panelData)));

    perpareForms();

    $(".entry-button").click(function() {
        const button = $(this);
        alert(button.val());
    });

    $("#changePasswordDailog").dialog({ autoOpen: false, width: 600 });
    $("#changePasswordDialog").click(function() {
        $("#changePasswordDailog").dialog("open");
    });

    $("#opener").click(function() {
        $("#dialog").dialog("open");
    });
}