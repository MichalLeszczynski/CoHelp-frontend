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

function prepareNewOrderForm() {
    // adress change
    $("#newOrderForm").submit(function (e) { e.preventDefault(); }).validate({
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
            deliveryDate: {
                required: true,
            },
            prefferedStore: {
                required: false,
            },
            dDate: {
                required: true,
            },
            dTime: {
                required: true,
            }
        },
        // Specify validation error messages
        messages: {
            city: {
                required: "Wpisz nazwę miasta",
            },
            addressLine: {
                required: "Wpisz nazwę ulicy oraz numer mieszkania",
            },
            postalCode: {
                required: "Wpisz swój kod pocztowy",
            },
            dDate: {
                required: "Wpisz datę dostawy",
            },
            dTime: {
                required: "Wpisz czas dostawy",
            }
        },
        submitHandler: function (form) {
            formData = $("#newOrderForm").serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            formData.address = { };
            formData.address.addressLine = formData.addressLine;
            formData.address.postalCode = formData.postalCode;
            formData.address.city = formData.city;
            delete formData.addressLine;
            delete formData.postalCode;
            delete formData.city;

            formData.deliveryDate = formData.dDate + "T" + formData.dTime;
            delete formData.dTime;
            delete formData.dDate;
            
            formData.products = {
                kasza: "12 x 500 g",
                mleko: "20l",
                makaron: "23.5 kg"
            };
            
            console.log(formData);
            $("#errorBox").remove();
            $.ajax({
                url: serverURL + "/api/Orders/NewOrder" + "?" + jQuery.param({userId: user.userId}),
                type: "POST",
                data: JSON.stringify(formData),
                contentType: "application/json",
                success: function (data) {
                    $("#newOrderDailog").dialog("close");
                    console.log(data);
                    alert("Pomyślnie utworzono nowe zlecenie!");
                    window.location.href = "app.html";
                },
                error: function (xhr, status, error) {
                    const msg = {
                        id: "errorBox",
                        errorMsg: null
                    };
                    const code = parseInt(xhr.status);
                    if (code == 404) {
                        msg.errorMsg = "Nie znaleziono podanego adresu!";
                    } else {
                        msg.errorMsg = "Nieznany błąd: " + code + " : " + xhr.responseText;
                    }
                    $("#newOrderForm").prepend($.parseHTML(Mustache.render(errorTemplate, msg)));
                }
            });
        }
    });
}

const productArray = [];

function renderInputs() {
    const inputs = $(".inputs");
    inputs.children().remove();
    productArray.forEach(function(item, index) {
        const str = `
            <div class="entry">
                <div class="field block" style="background-color: {{color}}"></div>
                <div class="input-box">
                    <input class="field block input-label" type="text" placeholder="label" value="{{value}}" id="{{id}}"/>
                    <button class="field block" onclick="deleteInput({{id}})" type="button">Delete box</button>
                </div>
            </div>
        `;
        const element = $.parseHTML(Mustache.render(str, {color: item.color, id: index, value: item.label}));
        inputs.append(element);
    });

    $(".input-label").change(function() {
        labelsArr = [];
        $(".input-label").each(function() {
            labelsArr.push($(this).val());
        });

        for(let i = 0; i < productArray.length; i++) {
            productArray[i].label = labelsArr[i];
        }
    });
}

function deleteInput(id) {
    console.log(id);
    productArray.splice(id, 1);
    renderInputs();
    updateCanvas();
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
    prepareNewOrderForm();
    
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

    $("#newOrderDailog").dialog({ autoOpen: false, width: 600, closeText: "Zamknij panel" });
    $("#newOrderButton").click(function() {
        $("#newOrderDailog").dialog("open");
    });

    $(".panel").on("dialogclose", function( event, ui ) {
        $(".panel").dialog( "option", "position", { my: "center", at: "center", of: window } );
    });
}