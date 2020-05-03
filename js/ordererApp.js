const user = {
    accountType: null,
    authToken: null,
    userId: null
}

const orders = {
    accepted: null,
    finished: null,
    available: null
}

let loginTemplate = null;
let entryTemplate = null;
let mainPanelTemplate = null;

// Get templates with get
$.get('templates/entry.mst', function(data) {
    entryTemplate = data;
});

$.get('templates/login.mst', function(data) {
    loginTemplate = data;
    renderLogin();
});

$.get('templates/mainPanel.mst', function(data) {
    mainPanelTemplate = data;
});

function renderClear() {
    $("#content-box").children().remove();
}

function renderLogin() {
    let output = Mustache.render(loginTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);
    $("#loginbutton").click(
        function() {
            loginData = $("#loginform").serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            console.log(loginData);
            $.ajax({
                url: "http://185.238.75.42:16010/api/Auth/Login",
                type: "POST",
                data: loginData,
                success: function(data) {
                    user.accountType = data.accountType;
                    user.authToken = data.authToken;
                    user.userId = data.userId;
                    renderClear();
                    renderMainPanel();
                }
            });
        }
    );
}

function renderMainPanel() {
    let output = Mustache.render(mainPanelTemplate, {});
    output = $.parseHTML(output);
    $("#content-box").append(output);

    $.ajax({
        async: false,
        url: "http://185.238.75.42:16010/api/Orders/ContractorAcceptedOrdersHistory",
        type: "GET",
        data: {
            userId: user.userId
        },
        headers: {
            Authorization: "Bearer " + user.authToken
        },
        success: function(data) {
            orders.accepted = data;
        }
    });

    $.ajax({
        async: false,
        url: "http://185.238.75.42:16010/api/Orders/ContractorFinishedOrdersHistory",
        type: "GET",
        data: {
            userId: user.userId
        },
        headers: {
            Authorization: "Bearer " + user.authToken
        },
        success: function(data) {
            orders.finished = data;
        }
    });

    $.ajax({
        async: false,
        url: "http://185.238.75.42:16010/api/Orders/ContractorAvailableOrdersHistory",
        type: "GET",
        data: {
            userId: user.userId
        },
        headers: {
            Authorization: "Bearer " + user.authToken
        },
        success: function(data) {
            orders.available = data;
        }
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


function getSomeData() {
    
    data = {
        "date": "1293.21.20",
        "status": "Veri done"
    };
    var output = Mustache.render(entryTemplate, data);
    console.log(output);
    output = $.parseHTML(output);
    console.log(output);
    
    $("#target").append(output);
    // data = {
    //     "userId": 1
    // }

    // $.ajax({
    //     url: "http://185.238.75.42:16010/api/Orders/ContractorFinishedOrdersHistory",
    //     type: "GET",
    //     data: data,
    //     crossDomain: true,
    //     // contentType: "application/json",
    //     success: function(data) {
    //         console.log(data)
    //         document.getElementById('target').innerHTML = JSON.stringify(data);
    //     }
    // });

}
