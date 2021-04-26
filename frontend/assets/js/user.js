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

    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log(userInfo);

    document.getElementById("email").value = userInfo.email
    document.getElementById("address").value = userInfo.address;
    document.getElementById("name").value = userInfo.name;
});

// this should fetch data from the vendor-db, but for now it is hard coded
async function loadUserProfile() {
    document.getElementById("user-id").value = "testing"
    document.getElementById("user-email").value = "testing"
    document.getElementById("first-name").value = "testing"
    document.getElementById("last-name").value = "testing"
    document.getElementById("user-street").value = "testing"
    document.getElementById("user-city").value = "testing"
    document.getElementById("user-state").value = "testing"
    document.getElementById("user-zipcode").value = "testing"
}

async function updateUserProfile() {
    console.log("updating user profile")

}