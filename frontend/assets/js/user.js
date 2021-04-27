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

async function loadBids() {
    // remove existing quotations as we filter
    clearBids()

    // get the user id, which is the email
    userId = document.getElementById("email").value

    // get the quotation data
    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/getbids/?user_id="+userId
    console.log(url)
    try {
        const response = await fetch(url);
        const bidsList = await response.json();
        console.log(bidsList)

        // error check the response
        if (bidsList.errorType) {
            alert("Invalid in loading bids")
        } else {
            // go through the quotations
            var i = 0
            for (i=0; i<bidsList.bids_list.length; i++) {
                var date = bidsList.bids_list[i].date
                var user_id = bidsList.bids_list[i].user_id
                var address = bidsList.bids_list[i].address
                var vendor_id = bidsList.bids_list[i].vendor_id
                var company_name = bidsList.bids_list[i].company_name
                var price = "$ "+ bidsList.bids_list[i].price
            
                addBidRow(date, user_id, address, vendor_id, company_name, price)
            }
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in getting solar panel data")        
    }
}

async function acceptBid() {
    console.log("bid accepted")

    // get the vendor id
    for (var i=0;i<document.getElementsByClassName("quoteCheckBox").length;i++){
        if (document.getElementsByClassName("quoteCheckBox")[i].checked) {
            vendorID = document.getElementsByClassName("quoteCheckBox")[i].id
        }
    }

    // delete the quotation of this user from the quotation db
    // delete the bids from the bids db
    // send thank you email to the user
    // send email to the vendor
    userID = document.getElementById("email").value
    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/acceptbid/?user_id="+userID+"&vendor_id="+vendorID
    console.log(url)
    try {
        const response = await fetch(url);
        const respJson = await response.json();
        console.log(respJson)

        // error check the response
        if (respJson.errorType) {
            alert("Error in updating database")
        } else {
            console.log("database updated, email sent")
        }
    }
    catch(error) {
        console.log(error)
        alert("Error in updating database")        
    }
}

function clearBids () {
    var table = document.getElementById("quotation-requests")
    while (table.firstChild) {
        table.removeChild(table.lastChild);
      }

}

function addBidRow (date, user_id, address, vendor_id, company_name, price) {
    var table = document.getElementById("quotation-requests")
    console.log(table)
    var row = table.insertRow(0)
    row.classList.add("quoteRow")
    //row.id = "quoteRow"
    var cell1 = row.insertCell(0);
    row.innerHTML =
    `
    <tr>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${date}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${vendor_id}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${company_name}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${address}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${user_id}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${price}</a></strong></div>
        </th>
        <td class="align-middle border-0"><input class="quoteCheckBox" type="checkbox" id="${vendor_id}"></input></td>
    </tr>
    `;
}




// need to change from hardcode
//loadUserProfile