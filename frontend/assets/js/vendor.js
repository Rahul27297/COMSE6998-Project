// this should fetch data from the vendor-db, but for now it is hard coded
async function loadVendorProfile() {
    document.getElementById("vendor-id").value = "testing"
    document.getElementById("company-name").value = "testing"
    document.getElementById("first-name").value = "testing"
    document.getElementById("last-name").value = "testing"
    document.getElementById("vendor-street").value = "testing"
    document.getElementById("vendor-city").value = "testing"
    document.getElementById("vendor-state").value = "testing"
    document.getElementById("vendor-zipcode").value = "testing"
}

async function updateVendorProfile() {
    console.log("updating user profile")

}

async function loadQuotationRequests() {
    // remove existing quotations as we filter
    clearQuotations()

    // get the quotation data
    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/getquotationreq/"
    try {
        const response = await fetch(url);
        const qtyLists = await response.json();
        console.log(qtyLists)

        // error check the response
        if (qtyLists.errorType) {
            alert("Invalid in calculating economics")
        } else {
            // go through the quotations
            var i = qtyLists.quotation_list.length-1
            for (i=qtyLists.quotation_list.length-1; i>=0; i--) {
                var date = qtyLists.quotation_list[i].date
                var quoteId = qtyLists.quotation_list[i].user_id
                var location = qtyLists.quotation_list[i].location
                var solarPanel = qtyLists.quotation_list[i].solar_panel
                var inverter = qtyLists.quotation_list[i].inverter
                var estPrice = "$ "+ qtyLists.quotation_list[i].price
                

                var num = i+1

                addQtyRow(num, date, quoteId, location, solarPanel, inverter, estPrice)
            }
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in getting solar panel data")        
    }
}

async function sendBid() {
    // get the data from the input fields
    var vendorID = document.getElementById("email").value
    var companyName = document.getElementById("name").value
    var address = document.getElementById("address").value
    /*
    var street = document.getElementById("vendor-street").value
    var city = document.getElementById("vendor-city").value
    var state = document.getElementById("vendor-state").value
    var zipCode = document.getElementById("vendor-zipcode").value
    var address = street + ", " + city + ", " + state + ", " + zipCode
    */

    var qtyLists = []
    // see the checkboxes
    qtyLength = document.getElementsByClassName("quoteRow").length
    for (i = 0; i < qtyLength; i++) {
        if (document.getElementsByClassName("quoteRow")[i].getElementsByClassName("quoteCheckBox")[0].checked) {
            qtyLists.push(document.getElementsByClassName("quoteRow")[i].getElementsByClassName("quoteCheckBox")[0].id)
        }
    }
    console.log(qtyLists)

    // hard coded data needs to change
    const data = {
        user_id_lists: qtyLists,
        vendor_id: vendorID,
        vendor_company_name: companyName,
        vendor_address: address
    }

    console.log(JSON.stringify(data))
    console.log(data)

    try {
        url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/uploadbid/"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const json = await response.json();
        console.log(json);
    }
    catch(error) {
        console.log(error)
        alert("Error in uploading quotation request")
    }
}

function clearQuotations () {
    var table = document.getElementById("quotation-requests")
    while (table.firstChild) {
        table.removeChild(table.lastChild);
      }

}

function addQtyRow (num, date, quoteId, location, solarPanel, inverter, estPrice) {
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
            <div class="media-body ml-3"><strong class="h6"><a class="quote-entry reset-anchor animsition-link" >${num}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${date}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${quoteId}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${location}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${solarPanel}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${inverter}</a></strong></div>
        </th>
        <th class="pl-0 border-0" scope="row">
            <div class="media-body ml-3"><strong class="h6"><a class="reset-anchor animsition-link" >${estPrice}</a></strong></div>
        </th>
        <td class="align-middle border-0"><input class="quoteCheckBox" type="checkbox" id="${quoteId}"></input></td>
    </tr>
    `;
}