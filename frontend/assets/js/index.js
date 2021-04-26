$(document).ready(function () {
    console.log("Ready!");
    var userLoggedIn = sessionStorage.getItem("userLoggedIn");
    var userName = sessionStorage.getItem("userName");
    var userEmail = sessionStorage.getItem("userEmail");

    console.log(userEmail);
    if (userLoggedIn == "0")
        window.location.href = './signup.html';
    else
        document.getElementById("userName").innerHTML = "Hello " + userName;
});

