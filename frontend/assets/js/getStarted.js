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
        var solarPanelQty = parseInt(document.getElementById("out-solar-panel-quantity").value)
        var inverterPriceRaw = totalCost.inverter.price
        var inverterPrice = parseFloat(inverterPriceRaw.substring(1,inverterPriceRaw.length))
        var inverterQty = parseInt(document.getElementById("out-inverter-quantity").value)
        var systemCost = roundToTwo(((solarPanelPrice*solarPanelQty) + (inverterPrice*inverterQty))*2.5)

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

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/getsolarpanel/?solar_panel_brand="+solarPanelBrand
    console.log(url)
    try {
        const response = await fetch(url);
        const solarPanelData = await response.json();
        console.log(solarPanelData)

        // error check the response
        if (solarPanelData.errorType) {
            alert("Invalid in getting the solar panel brand")
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

    url = "https://moz3yfg111.execute-api.us-east-1.amazonaws.com/dev3/getinverter/?inverter_brand="+inverterBrand+"&sys_cap="+sysCap
    console.log(url)
    try {
        const response = await fetch(url);
        const inverterData = await response.json();
        console.log(inverterData)


        // error check the response
        if (inverterData.errorType) {
            alert("Invalid in getting inverter data")
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

    // the user info from the session token
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    const data = {
        // this profile info will need to be changed to user profile data
        profile: {
            user_id: userInfo.email,
            first_name: userInfo.name.split(" ")[0],
            last_name: userInfo.name.split(" ")[1]
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
        alert("Quotation Sent!")

        // clear the fields
    }
    catch(error) {
        console.log(error)
        alert("Error in uploading quotation request")
    }
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      
  });
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


inverter_brands = ['Ginlong Solis', 'Shenzhen Must Power', 'TSUN', 'Atess Power Technology', 'SinoSoar', 'Grandglow New Energy', 'Sacolar', 'Imeon Energy', 'Super Solar', 'Constant Technology', 'Cosuper Energy', 'Runtech', 'BWSP', 'Sunray Power', 'Zlpower', 'Garnde Solar Energy', 'Shenzhen Purance Technology', 'CoHeart Power', 'Guanzhou Poojin Electronic', 'BR Solar', 'Sandi Electric', 'Lux Power Technology', 'Dongguan Runlin New Energy', 'Autarco', 'UPNE-Tech', 'SUG New Energy', 'NETek', 'Daxieworld']
autocomplete(document.getElementById("inverter-brand"), inverter_brands);

solar_panel_brands = ['Runsol PV', 'Reeco Logic', 'AE Solar', 'ECO DELTA POWER', 'Sunlike Solar', 'Resun Solar', 'East Lux Energy', 'GEP-Solar Manufacturing', 'Alpha Solar Planet', 'SpolarPV', 'UZON PV', 'Sunrise', 'TPL Solar', 'Fortunes Solar', 'Horay Solar', 'Csunpower', 'Luxen Solar Energy', 'Betop (EU) Tech', 'Huicheng Energy', 'Infinity New Energy', 'SWISS SOLAR', 'Mysolar USA', 'JF Solar Technology', 'AXITEC', 'Topsky Electronics Technology', 'Sunpro Power', 'Cell Solar', 'DAH Solar', 'Topsky Energy', 'JS Solar', 'Yangzhou Jinghua New Energy Technology', 'Sunday Energy', 'Hershey-Power', 'Sunket New Energy', 'Exiom Solution', 'Mario Solar', 'PolyCrown Solar Tech', 'GPPV New Energy', 'Ulica Solar', 'Shenzhen XXR Solar Manufacturer', 'ET Solar', 'Runtech', 'Sinoltech', 'Jiangsu Runda PV', 'Future Solar', 'Austa Energy', 'Sunergy', 'Autarco', 'Just Solar', 'SP Enerji', 'ASV', 'Amerisolar', 'Beijing Kexing Technology', 'PuDu Green Energy', 'Soliswatt', 'JJ PV Solar', 'RK Solar', 'TommaTech', 'Solar Power Vietnam', 'Almaden Morocco', 'Suzhou PV Solar Tech', 'Hanfy New Energy Technology', 'Odul Solar', 'Xiaotian Energy', 'Lightway Solar', 'NE Solar', 'Voltec Solar', 'Tamrons', 'Shenzhen Top Solar Energy', 'Rixing Electronics', 'Sic Solar', 'Daxieworld', 'Einnova Solarline', 'Jayu Solar', 'Powitt Solar', 'Hestia Solar', 'KHK SOLAR', 'EYONGPV', 'Jinshi Solar', 'HUASHUN SOLAR', 'SFED', 'Senta Energy', 'AEET Energy', 'Wuxi Finergy Tech', 'Plus Power', 'Yinghua Solar', 'Linkkingsmart Solar', 'Regitec Solar', 'Senza Solar', 'Haotech', 'Jighisol', 'Sun King Energy Technology', 'Iberian Solar', 'Info-Svyaz', 'Sunconnection Worldwide', 'Alfa Solar Energy', 'Abora Energy', 'Raytech New Energy Materials', 'Giocosolutions', 'Ktech Solar', 'Macro-solar', 'Ankara Solar', 'AllemaSolar', 'Pogreen New Energy', 'Allesun New Energy', 'Anhui Schutten Solar Energy', 'Wisebiz', 'Jaje Solar', 'Teknik Solar Enerji', 'The Sol Patch', 'Eclipse Italia', 'Longi Solar', 'Trina Solar', 'Canadian Solar', 'Panasonic', 'Q-Cells']
autocomplete(document.getElementById("solar-panel-brand"), solar_panel_brands);