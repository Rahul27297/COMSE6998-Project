$(document).ready(function () {
    console.log("Ready!");

   document.getElementById("form-signup-confirm").style.display = "none";
   document.getElementById("form-login").style.display = "none";
   document.getElementById("success-alert").style.display = "none";
   document.getElementById("empty-alert").style.display = "none";
   document.getElementById("loader_signup").style.display = "none";
   document.getElementById("loader_verify").style.display = "none";
   document.getElementById("loader_login").style.display = "none";

   var login_display = 0;
   var signup_display = 1;

    function callSignUpAPI(body) {
        var params = {};
        console.log("callSignUpAPI");
        return sdk.userSignupPost(params, body, params);
    }

    function signup() {
        console.log("Signup");
        var inputEmail = document.getElementById("inputEmail").value;
        var inputPassword = document.getElementById("inputPassword").value;
        var inputConfirmPassword = document.getElementById("inputConfirmPassword").value;
        var inputName = document.getElementById("inputName").value;
        var inputHouse = document.getElementById("inputHouse").value;
        var inputCity = document.getElementById("inputCity").value;
        var inputState = document.getElementById("inputState").value;
        var inputZip = document.getElementById("inputZip").value;
        var type = document.getElementById("userType").value;
        
        if (inputEmail == "" || inputPassword == "" || inputName == "" || inputHouse == "" || inputCity == "" || inputState == "" || inputZip == "") {
            document.getElementById("empty-alert").style.display = "block";
            return;
        }

        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputEmail))) {
            window.alert("Invalid Email!");
        }
       
        if (inputPassword != inputConfirmPassword) {
            window.alert("Passwords do not match!");
        }
        var body = {
            "username": inputEmail,
            "password": inputPassword,
            "email": inputEmail,
            "name": inputName,
            "street": inputHouse,
            "city": inputCity,
            "state": inputState,
            "zip": inputZip,
            "type": type
        };
        console.log(body);
        document.getElementById("signup-button").style.display = "none";
        document.getElementById("loader_signup").style.display = "block";
        callSignUpAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(response.data.message);
            if (response.data.message == "success") {
                console.log("Signup Successful");
                sessionStorage.setItem("userName", inputName);
                document.getElementById("form-signup").style.display = "none";
                document.getElementById("form-signup-confirm").style.display = "block";
                document.getElementById("success-alert").style.display = "block";
                document.getElementById("success-alert").innerHTML = "SignUp Successful! Please check your email for verification code.";
            } else {
                document.getElementById("signup-button").style.display = "block";
                document.getElementById("loader_signup").style.display = "none";
            }
        });
    }

    function callSignUpConfirmAPI(body) {
        var params = {};
        console.log("callSignUpAPI");
        return sdk.userConfirmsignupPost(params, body, params);
    }

    function verify() {
        console.log("Signup");
        var inputEmail = document.getElementById("inputEmailConfirm").value;
        var inputPassword = document.getElementById("inputPasswordConfirm").value;
        var inputCode = document.getElementById("inputCode").value;
       
        var body = {
            "username": inputEmail,
            "password": inputPassword,
            "code": inputCode,
        };
        console.log(body);
        document.getElementById("verify-button").style.display = "none";
        document.getElementById("loader_verify").style.display = "block";
        callSignUpConfirmAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(response);
            if (response.data.username == inputEmail) {
                document.getElementById("success-alert").style.display = "block";
                document.getElementById("success-alert").innerHTML = "Verification Successful! Please login to continue";
                login_setup();
            } else {
                document.getElementById("verify-button").style.display = "block";
                document.getElementById("loader_verify").style.display = "none";
            }
        });
    }

    function callGetUserInfoAPI(body) {
        var params = {};
        console.log("callGetUserInfoAPI");
        return sdk.getUserInfoPost(params, body, params);
    }

    function getUserInfo(access_token) {
        var body = {
            "access_token": access_token
        };

        callGetUserInfoAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(JSON.parse(response.data.body));
            var userInfo = JSON.parse(response.data.body);
            var userInfo = JSON.parse(response.data.body);
            sessionStorage.setItem("userInfo", response.data.body);
            sessionStorage.setItem("userName", userInfo.name);
            window.location.href = './index.html';
        });
    }

    function callLoginAPI(body) {
        var params = {};
        console.log("callSignUpAPI");
        return sdk.userLoginPost(params, body, params);
    }

    function login() {
        console.log("Signup");
        var inputEmail = document.getElementById("inputEmailLogin").value;
        var inputPassword = document.getElementById("inputPasswordLogin").value;
       
        var body = {
            "username": inputEmail,
            "password": inputPassword
        };
        console.log(body);
        document.getElementById("login-button").style.display = "none";
        document.getElementById("loader_login").style.display = "block";
        callLoginAPI(body).then((response) => {
            console.log("Recieved Response");
            if (response.data.error == false) {
                console.log(response.data.data.access_token);
                var access_token = response.data.data.access_token;
                document.getElementById("success-alert").style.display = "block";
                document.getElementById("success-alert").innerHTML = "Login Successful!";
                sessionStorage.setItem("userEmail", inputEmail);
                sessionStorage.setItem("userLoggedIn", "1");
                sessionStorage.setItem("access_token", access_token);
                getUserInfo(access_token);
            } 
            else {
                document.getElementById("login-button").style.display = "block";
                document.getElementById("loader_login").style.display = "none";
                alert("Incorrect username/password");
            }
        });
    }

    function display_login() {
        document.getElementById("form-login").style.display = "block";
        document.getElementById("form-signup").style.display = "none";
        document.getElementById("form-signup-confirm").style.display = "none";
        document.getElementById("login-button").style.display = "block";
        document.getElementById("loader_login").style.display = "none";
    }

    function display_signup() {
        document.getElementById("form-login").style.display = "none";
        document.getElementById("form-signup").style.display = "block";
        document.getElementById("signup-button").style.display = "block";
        document.getElementById("loader_signup").style.display = "none";
    }


    $('.signup-button').click(function () {
        if (signup_display == 1) {
            signup();
        } else {
            login_display = 0;
            signup_display = 1;
            display_signup();
        }
    });

    $('.verify-button').click(function () {
        verify();
    });

    function login_setup() {
        if (login_display == 1) {
            login();
        }
        else {
            signup_display = 0;
            login_display = 1;
            display_login();
        }
    }

    $('.login-button').click(function () {
        console.log(login_display)
        login_setup();
    });

});