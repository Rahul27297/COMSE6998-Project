$(document).ready(function () {
    console.log("Ready!");
    var userLoggedIn = sessionStorage.getItem("userLoggedIn");
    var userName = sessionStorage.getItem("userName");
    var userEmail = sessionStorage.getItem("userEmail");
    var access_token = sessionStorage.getItem("access_token");

    console.log(userEmail);
    if (userLoggedIn != "1")
        window.location.href = './signup.html';
    else
        document.getElementById("userName").innerHTML = "Hello " + userName;

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
});

