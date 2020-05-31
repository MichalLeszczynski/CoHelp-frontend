function getContractorOrders() {

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

function renderContractorPanel() {
    console.log(user);
    panelData.name = user.name;
    panelData.surname = user.surname;
    panelData.city = user.city;
    panelData.addressLine = user.addressLine;
    panelData.postalCode = user.postalCode;
    $("#title-box").html("Panel pomocnika");

    getContractorOrders();

    $("#content-box").append($.parseHTML(Mustache.render(contractorTemplate, panelData)));

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

    if(panelData.available.length === 0) {
        $("#available-list").html("Pusto tu...");
    }

    if(panelData.accepted.length === 0) {
        $("#accepted-list").html("Pusto tu...");
    }

    if(panelData.finished.length === 0) {
        $("#finished-list").html("Pusto tu...");
    }


    // prepare buttons
    $(".entry-button").click(function() {
        const button = $(this);
        const id = "#panel-" + button.val();
        $(id).dialog("open");
    });

    
    $(".accept-order-button").click(function() {
        const button = $(this);
        const queryData = {
            orderId: button.val(),
            userId: user.userId
        };
        $(".panel").dialog("close");
        $.ajax({
            url: serverURL + "/api/OrdersManagement/AcceptOrder" + "?" + jQuery.param(queryData),
            type: "PUT",
            contentType: "application/json",
            success: function(data) {
                alert("Zlecenie przyjęte pomyślnie!");
                console.log(data);
                window.location.href = "app.html";
            },
            error: function(xhr, status, error) {
                const code = parseInt(xhr.status);
                alert("Nie udało się przyjąć tego zlecenia z powodu błędu numer " + code);
                window.location.href = "app.html";
            }
        });
    });

    $(".cancel-order-button").click(function() {
        const button = $(this);
        const queryData = {
            orderId: button.val(),
            userId: user.userId
        };
        $(".panel").dialog("close");
        $.ajax({
            url: serverURL + "/api/OrdersManagement/CancelOrder" + "?" + jQuery.param(queryData),
            type: "PUT",
            contentType: "application/json",
            success: function(data) {
                alert("Zlecenie zostało anulowane!");
                console.log(data);
                window.location.href = "app.html";
            },
            error: function(xhr, status, error) {
                const code = parseInt(xhr.status);
                alert("Nie udało się anulować tego zlecenia z powodu błędu numer " + code);
                window.location.href = "app.html";
            }
        });
    });

    $(".cash-amount-button").click(function() {
        const button = $(this);
        const orderId = button.val();
        const inputFieldId = "#cash-amount-input-" + orderId;
        const queryData = {
            orderId: orderId,
            userId: user.userId,
            cashAmount: $(inputFieldId).val()
        };
        console.log(queryData);
        $.ajax({
            url: serverURL + "/api/OrdersManagement/SelectCashAmount" + "?" + jQuery.param(queryData),
            type: "PUT",
            contentType: "application/json",
            success: function(data) {
                alert("Pomyślnie ustawione nową cenę!");
            },
            error: function(xhr, status, error) {
                const code = parseInt(xhr.status);
                alert("Nie udało się ustawić ceny z powodu błędu numer " + code);
                window.location.href = "app.html";
            }
        });
    });

    $("#changePasswordDailog").dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    $("#changePasswordButton").click(function() {
        $("#changePasswordDailog").dialog("open");
    });

    $("#changeAdressDailog").dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    $("#changeAdressButton").click(function() {
        $("#changeAdressDailog").dialog("open");
    });
}