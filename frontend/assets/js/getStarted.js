async function getLocation() {
    street = document.getElementById("add-street").value
    city = document.getElementById("add-city").value
    state = document.getElementById("add-state").value
    zipCode = document.getElementById("add-zipcode").value

    //street = "180 Brookline Ave"
    //city = "Boston"
    //state = "MA"
    //zipCode = "02215"

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev1/getlocation/?street="+street+"&city="+city+"&state="+state+"&zipcode="+zipCode
    console.log(url)
    try {
        const response = await fetch(url);
        const location = await response.json();
        console.log(location.lat);
        console.log(location.lon)

        // error check the response
        if (location.errorType) {
            alert("Invalid address/location") 
        } else if (street == "" | city == "" | state == "" | zipCode == ""){
            alert("Invalid address/location") 
        }
        else {
            // update in the outputs section
            document.getElementById("out-lat").value = location.lat
            document.getElementById("out-lon").value = location.lon
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid address/location")        
    }
}

async function getSystemSpecs() {
    lat = document.getElementById("out-lat").value
    lon = document.getElementById("out-lon").value
    sysCap = document.getElementById("sys-cap").value
    elecRate = document.getElementById("elec-rate").value
    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/getsystemspecs/?lat="+lat+"&lon="+lon+"&sys_cap="+sysCap+"&elec_rate="+elecRate
    console.log(url)
    try {
        const response = await fetch(url);
        const specs = await response.json();
        console.log(specs)

        // error check the response
        if (specs.errorType) {
            alert("Invalid in the specification inputs")
        } else {
            // update in the outputs section
            document.getElementById("out-annual-energy").value = specs.annual_gen
            document.getElementById("out-annual-savings").value = specs.annual_cost_savings
            document.getElementById("out-lifetime-savings").value = specs.lifetime_cost_savings
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in the specification inputs")        
    }
}

async function getTotalCost() {

    solarPanelBrand = document.getElementById("solar-panel-brand").value
    inverterBrand = document.getElementById("inverter-brand").value

    solarPanelBrand = "Trina Solar"
    inverterBrand = "Ginlong Solis"

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/gettotalcost/?solar_panel_brand="+solarPanelBrand+"&inverter_brand="+inverterBrand
    console.log(url)
    try {
        const response = await fetch(url);
        const totalCost = await response.json();
        console.log(totalCost)

        // compute the total cost
        var solarPanelPriceRaw = totalCost.solar_panel.price
        var solarPanelPrice = parseFloat(solarPanelPriceRaw.substring(1,solarPanelPriceRaw.length))
        var inverterPriceRaw = totalCost.inverter.price
        var inverterPrice = parseFloat(inverterPriceRaw.substring(1,inverterPriceRaw.length))
        var systemCost = roundToTwo((solarPanelPrice + inverterPrice)*1.5)

        // error check the response
        if (totalCost.errorType) {
            alert("Error in fetching component costs")
        } else {
            // update the total cost
            document.getElementById("out-total-cost").value = systemCost.toString()
        }
    }
    catch(error) {
        console.log(error)
        alert("Error in fetching component costs")        
    }

}

async function getEconomics() {
    await getTotalCost()
    
    totalCost = document.getElementById("out-total-cost").value
    annualCostSavings = document.getElementById("out-annual-savings").value
    lifeTimeCostSavings = document.getElementById("out-lifetime-savings").value
    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/geteconomics/?total_cost="+totalCost+"&annual_cost_savings="+annualCostSavings+"&lifetime_cost_savings="+lifeTimeCostSavings
    console.log(url)
    try {
        const response = await fetch(url);
        const econ = await response.json();
        console.log(econ)

        // error check the response
        if (econ.errorType) {
            alert("Invalid in calculating economics")
        } else {
            // update in the outputs section
            document.getElementById("out-pbp").value = econ.payback
            document.getElementById("out-roi").value = econ.roi
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in calculating economics")        
    }
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}