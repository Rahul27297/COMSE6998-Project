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
            var i = 0
            for (i=0; i<qtyLists.quotation_list.length; i++) {
                var date = "sample"
                var quoteId = qtyLists.quotation_list[i].quotation_id
                var location = qtyLists.quotation_list[i].location
                var solarPanel = qtyLists.quotation_list[i].solar_panel
                var inverter = qtyLists.quotation_list[i].inverter
                var estPrice = qtyLists.quotation_list[i].price
            
                addQtyRow(date, quoteId, location, solarPanel, inverter, estPrice)
            }
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in getting solar panel data")        
    }




    //addCartRow(date, quoteId, location, solarPanel, inverter, estPrice)
}

async function sendBid() {
    console.log("sending the bid")

    var qtyLists = []
    // see the checkboxes
    qtyLength = document.getElementsByClassName("quoteRow").length
    for (i = 0; i < qtyLength; i++) {
        if (document.getElementsByClassName("quoteRow")[i].getElementsByClassName("quoteCheckBox")[0].checked) {
            qtyLists.push(document.getElementsByClassName("quoteRow")[i].getElementsByClassName("quoteCheckBox")[0].id)
        }
    }
    console.log(qtyLists)

    // send the qtyLists filled with quotation IDs to the backend
}

function clearQuotations () {
    var table = document.getElementById("quotation-requests")
    while (table.firstChild) {
        table.removeChild(table.lastChild);
      }

}

function addQtyRow (date, quoteId, location, solarPanel, inverter, estPrice) {
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


loadVendorProfile()