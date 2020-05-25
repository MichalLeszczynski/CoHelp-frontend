function renderRemindPassword() {
    $("#subtitle-box").html("Przypomnienie hasła");
    $("#content-box").append($.parseHTML(Mustache.render(remindPasswordTemplate, {})));

    $("#toLoginPage").click(
        function() {
            renderClear();
            renderLogin();
        }
    );
    
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
            let registerData = $("#remindForm").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
           const phoneNumber = "+48" + registerData.phoneNumber;

            $.ajax({
                url: serverURL + "/api/AccountSettings/RemindPassword" + "?phoneNumber=" + encodeURIComponent(phoneNumber),
                type: "POST",
                contentType: "application/json",
                success: function(data) {
                    renderClear();
                    renderLogin();
                    alert("Wysłaliśmy hasło na podany numer telefonu!");
                },
                error: function(xhr, status, error) {
                    $("#loginErrorBox").remove();
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
}