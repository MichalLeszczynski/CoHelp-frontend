function getPaymasterOrders() {
    panelData.available = [];
    panelData.accepted = [];
    panelData.finished = [];
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/PaymasterOrdersHistory" + "?userId=" + user.userId,
        type: "GET",
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) {
            console.log(data);
            const orders = remapProducts(data);
            for(const item of orders) {
                if(item.status.toLowerCase() == "open") {
                    panelData.available.push(item);
                } 
                else if(item.status.toLowerCase() == "closed"){
                    panelData.finished.push(item);
                }
                else {
                    panelData.accepted.push(item);
                }
            }
        }
    });
    
    console.log(panelData);
}

function renderPaymasterPanel() {
    console.log(user);
    panelData.name = user.name;
    panelData.surname = user.surname;
    panelData.city = user.city;
    panelData.addressLine = user.addressLine;
    panelData.postalCode = user.postalCode;
    $("#title-box").html("Panel zlecającego");

    getPaymasterOrders();

    $("#content-box").append($.parseHTML(Mustache.render(paymasterTemplate, panelData)));

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

    
    $(".new-order-button").click(function() {
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