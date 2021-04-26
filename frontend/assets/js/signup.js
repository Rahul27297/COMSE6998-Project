$(document).ready(function () {
    console.log("Ready!");

   document.getElementById("form-signup-confirm").style.display = "none";
   document.getElementById("form-login").style.display = "none";
   document.getElementById("success-alert").style.display = "none";
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
        var inputName = document.getElementById("inputName").value;
        var inputHouse = document.getElementById("inputHouse").value;
        var inputCity = document.getElementById("inputCity").value;
        var inputState = document.getElementById("inputState").value;
        var inputZip = document.getElementById("inputZip").value;
        var type = document.getElementById("userType").value;
       
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
        callSignUpConfirmAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(response);
            if (response.data.username == inputEmail) {
                document.getElementById("success-alert").style.display = "block";
                document.getElementById("success-alert").innerHTML = "Verification Successful! Please login to continue";
            }
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
        callLoginAPI(body).then((response) => {
            console.log("Recieved Response");
            console.log(response);
            if (response.data.error == false) {
                document.getElementById("success-alert").style.display = "block";
                document.getElementById("success-alert").innerHTML = "Login Successful!";
                sessionStorage.setItem("userEmail", inputEmail);
                sessionStorage.setItem("userLoggedIn", "1");
                window.location.href = './index.html';
            }
        });
    }

    function display_login() {
        document.getElementById("form-login").style.display = "block";
        document.getElementById("form-signup").style.display = "none";
        document.getElementById("form-signup-confirm").style.display = "none";
    }

    function display_signup() {
        document.getElementById("form-login").style.display = "none";
        document.getElementById("form-signup").style.display = "block";
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

    $('.login-button').click(function () {
        if (login_display == 1) {
            login();
        }
        else {
            signup_display = 0;
            login_display = 1;
            display_login();
        }
    });
});