const panelData = {
    accepted: null,
    finished: null,
    available: null,
    name: null,
    surname: null
};

function renderContractorPanel() {
    panelData.name = user.name;
    panelData.surname = user.surname;
    $("#subtitle-box").html("Panel pomocnika");
    
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

    $("#content-box").append($.parseHTML(Mustache.render(mainPanelTemplate, panelData)));

    $(".entry-button").click(function() {
        const button = $(this);
        alert(button.val());
    });

    $("#dialog").dialog({ autoOpen: false, width: 600 });
    $("#opener").click(function() {
        $("#dialog").dialog("open");
    });
}