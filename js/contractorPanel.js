function renderContractorPanel() {
    $("#subtitle-box").html("Panel pomocnika");
    $("#content-box").append($.parseHTML(Mustache.render(mainPanelTemplate, {})));

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

    // $("#loginbutton").click(
    //     function() {
    //         loginData = $("#loginform").serializeArray().reduce(function(obj, item) {
    //             obj[item.name] = item.value;
    //             return obj;
    //         }, {});
    //         console.log(loginData);
    //     }
    // );
}