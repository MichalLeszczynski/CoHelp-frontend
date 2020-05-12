const orders = {
    accepted: null,
    finished: null,
    available: null
}

function renderContractorPanel() {
    $("#subtitle-box").html("Panel pomocnika");
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAcceptedOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.accepted = data; }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorFinishedOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.finished = data; }
    });
    
    $.ajax({
        async: false,
        url: serverURL + "/api/Orders/ContractorAvailableOrdersHistory",
        type: "GET",
        data: { userId: user.userId },
        headers: { Authorization: "Bearer " + user.authToken },
        success: function(data) { orders.available = data; }
    });
    
    console.log(orders);
    $("#content-box").append($.parseHTML(Mustache.render(mainPanelTemplate, orders)));

    $(".entry-button").click(function() {
        const button = $(this);
        alert(button.val());
    });

    $("#dialog").dialog({ autoOpen: false, width: 600 });
    $("#opener").click(function() {
        $("#dialog").dialog("open");
    });
}