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