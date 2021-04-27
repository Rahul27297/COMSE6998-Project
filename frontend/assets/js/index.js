$(document).ready(function () {
    console.log("Ready!");
    var userLoggedIn = 0;
    userLoggedIn = sessionStorage.getItem("userLoggedIn");
    var userName = sessionStorage.getItem("userName");
    var userEmail = sessionStorage.getItem("userEmail");
    var access_token = sessionStorage.getItem("access_token");
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    var isVendor = 0;
    console.log(isVendor);
    if (userInfo.type == "vendor") {
        isVendor = 1;
        console.log(isVendor);
    }

    if (isVendor) {
        console.log(isVendor);
        document.getElementById("get-started-link").style.display = "none";
        document.getElementById("get-started-caption_1").style.display = "none";
        document.getElementById("get-started-caption_2").style.display = "none";
        document.getElementById("get-started-caption_3").style.display = "none";
    }

    var customerSignup = document.getElementById("customerSignup");
    var vendorSignup = document.getElementById("vendorSignup");
    var userNameDisplay =  document.getElementById("userNameDisplay");

    if (userLoggedIn != "1") {
        customerSignup.style.display = "block";
        vendorSignup.style.display = "block";
        userNameDisplay.style.display = "none";
    }
    else {
        document.getElementById("userName").innerHTML = "Hello " + userName;
        customerSignup.style.display = "none";
        vendorSignup.style.display = "none";
        userNameDisplay.style.display = "block";
    }

    function logoutUser() {
        console.log("Logout");
        sessionStorage.clear();
        window.location.href = './index.html';
    }

    function callGetUserInfoAPI(body) {
        var params = {};
        console.log("callGetUserInfoAPI");
        return sdk.getUserInfoPost(params, body, params);
    }

    function getUserInfo() {
        var body = {
            "access_token": access_token
        };

        callGetUserInfoAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(JSON.parse(response.data.body));
            var userInfo = JSON.parse(response.data.body);
            sessionStorage.setItem("userInfo", response.data.body);
            if (userInfo.type == "customer") {
                window.location.href = './user.html';
            } else if (userInfo.type == "vendor") {
                window.location.href = './vendor.html';
            }
        });
    }

    $('.userName').click(function () {
        getUserInfo();
    });

    $('.logout').click(function () {
        logoutUser();
    });
});

