const panelData = {
    available: null,
    accepted: null,
    finished: null,
    name: null,
    surname: null
};

let contractorTemplate = null;
let paymasterTemplate = null;
let entryTemplate = null;
let dialogTemplate = null;


// all data about current user
const user = {};

function prepareApp() {

    $("#logout").click(function () {
        sessionStorage.clear();
        window.location.href = "login.html";
    });

    // templates
    $.ajax({
        url: 'templates/contractor.mst',
        async: false,
        success: function (data) {
            contractorTemplate = data;
        }
    });

    $.ajax({
        url: 'templates/paymaster.mst',
        async: false,
        success: function (data) {
            paymasterTemplate = data;
        }
    });

    $.ajax({
        url: 'templates/entry.mst',
        async: false,
        success: function (data) {
            entryTemplate = data;
        }
    });

    $.ajax({
        url: 'templates/dialog.mst',
        async: false,
        success: function (data) {
            dialogTemplate = data;
        }
    });

    // user data
    user.accountType = sessionStorage.getItem('accountType');
    user.authToken = sessionStorage.getItem('authToken');
    user.userId = sessionStorage.getItem('userId');
    user.name = sessionStorage.getItem('name');
    user.surname = sessionStorage.getItem('surname');
    user.addressLine = sessionStorage.getItem('addressLine');
    user.city = sessionStorage.getItem('city');
    user.postalCode = sessionStorage.getItem('postalCode');

    if (user.accountType === "contractor") {
        renderContractorPanel();
    } else if (user.accountType === "paymaster") {
        renderPaymasterPanel();
    } else {
        alert("Twoja sesja wygasła, zaloguj się ponownie.");
        window.location.href = "login.html";
    }

}