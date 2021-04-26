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
            document.getElementById("out-street").value = street
            document.getElementById("out-city").value = city
            document.getElementById("out-state").value = state
            document.getElementById("out-zipcode").value = zipCode
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

    //solarPanelBrand = "Trina Solar"
    //inverterBrand = "Ginlong Solis"

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
            
            // update the solar panel in the results
            document.getElementById("out-solar-panel-brand").value = totalCost.solar_panel.brand
            document.getElementById("out-solar-panel-eff").value = totalCost.solar_panel.efficiency
            document.getElementById("out-solar-panel-power").value = totalCost.solar_panel.power
            document.getElementById("out-solar-panel-warranty").value = "25 Years"
            
            // update the inverter in the results
            document.getElementById("out-inverter-brand").value = totalCost.inverter.brand
            document.getElementById("out-inverter-eff").value = "92.50 %"
            document.getElementById("out-inverter-power").value = totalCost.inverter.power
            document.getElementById("out-inverter-warranty").value = totalCost.inverter.warranty
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

async function checkSolarPanel() {
    solarPanelBrand = document.getElementById("solar-panel-brand").value

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/getsolarpanel/?solar_panel_brand="+solarPanelBrand
    console.log(url)
    try {
        const response = await fetch(url);
        const solarPanelData = await response.json();
        console.log(solarPanelData)

        // error check the response
        if (solarPanelData.errorType) {
            alert("Invalid in calculating economics")
        } else {
            // update in the outputs section
            document.getElementById("solar-panel-eff").value = solarPanelData.solar_panel.efficiency
            document.getElementById("solar-panel-power").value = solarPanelData.solar_panel.power
            document.getElementById("solar-panel-warranty").value = "25 Years"

            // calculate how much quantity is needed
            solarPanelPower = parseFloat(solarPanelData.solar_panel.power.split(" ")[0])
            sysCap = parseFloat(document.getElementById("sys-cap").value)
            qty = 1
            while (qty*solarPanelPower < sysCap) {
                qty += 1
            } 
            document.getElementById("solar-panel-quantity").value = qty.toString()
            document.getElementById("out-solar-panel-quantity").value = qty.toString()
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in getting solar panel data")        
    }
}

async function checkInverter() {
    inverterBrand = document.getElementById("inverter-brand").value
    sysCap = document.getElementById("sys-cap").value

    // calculate how much quantity is needed

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/getinverter/?inverter_brand="+inverterBrand
    console.log(url)
    try {
        const response = await fetch(url);
        const inverterData = await response.json();
        console.log(inverterData)


        // error check the response
        if (inverterData.errorType) {
            alert("Invalid in calculating economics")
        } else {
            // update in the outputs section
            document.getElementById("inverter-eff").value = "92.50 %"
            document.getElementById("inverter-power").value = inverterData.inverter.power
            document.getElementById("inverter-warranty").value = inverterData.inverter.warranty

            // calculate how much quantity is needed
            inverterPower = parseFloat(inverterData.inverter.power.split(" ")[0])
            sysCap = parseFloat(document.getElementById("sys-cap").value)/1000

            qty = 1
            while (qty*inverterPower < sysCap) {
                qty += 1
            } 
            document.getElementById("inverter-quantity").value = qty.toString()
            document.getElementById("out-inverter-quantity").value = qty.toString()
        }
    }
    catch(error) {
        console.log(error)
        alert("Invalid in getting inverter data")        
    }
}

async function sendQuotationReq() {
    console.log("sending quotation to db")

    // get the values to send

    const data = {
        // this profile info will need to be changed to user profile data
        profile: {
            user_id: "aw3306@columbia.edu",
            first_name: "Aditya",
            last_name: "Wikara"
        },
        address: {
            street: document.getElementById("out-street").value,
            city: document.getElementById("out-city").value,
            state: document.getElementById("out-state").value,
            zipCode: document.getElementById("out-zipcode").value
        },
        location: {
            lat: document.getElementById("out-lat").value,
            lon: document.getElementById("out-lon").value
        },
        solar_panel: {
            brand: document.getElementById("out-solar-panel-brand").value,
            quantity: document.getElementById("out-solar-panel-quantity").value,
            efficiency: document.getElementById("out-solar-panel-eff").value,
            power: document.getElementById("out-solar-panel-power").value,
            warranty: document.getElementById("out-solar-panel-warranty").value
        },
        inverter: {
            brand: document.getElementById("out-inverter-brand").value,
            quantity: document.getElementById("out-inverter-quantity").value,
            efficiency: document.getElementById("out-inverter-eff").value,
            power: document.getElementById("out-inverter-power").value,
            warranty: document.getElementById("out-inverter-warranty").value
        },
        performance: {
            annual_energy: document.getElementById("out-annual-energy").value,
            annual_cost_savings: document.getElementById("out-annual-savings").value,
            lifetime_cost_savings: document.getElementById("out-lifetime-savings").value
        },
        economics: {
            system_cost: document.getElementById("out-total-cost").value,
            payback: document.getElementById("out-pbp").value,
            roi: document.getElementById("out-roi").value
        }
    }

    console.log(JSON.stringify(data))
    console.log(data)

    try {
        url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev2/uploadquotereq/"
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

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}