var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('promise');
var reqnew = require('request');
var apps = express();
apps.use(bodyParser.json());
var flightstatus = { 'A': 'Active', 'C': 'Cancelled', 'D': 'Diverted', 'DN': 'Data Source Need', 'L': 'Landed', 'NO': 'Not Operational', 'R': 'Redirected', 'S': 'Scheduled', 'U': 'Unknown' };
let ApiAiApp = require('actions-on-google').ApiAiAssistant;
const apid = '6aac18a6';
const apkey = '40a7e359cb020a07ead5159c2d5d8162';
apps.get("/", function (req, res) {
    res.send("Server is running");
});
var callrestapi = function (apid, apkey, carrier, flight, year, month, day) {
    return new Promise(function (resolve, reject) {
        var r;
        var options = {};
        options.url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${carrier}/${flight}/arr/${year}/${month}/${day}?appId=${apid}&appKey=${apkey}&utc=false`;
        reqnew(options, (error, resps, body) => {
            try {
            console.log(body);
                if ((typeof body) == "string") {

                    var result = JSON.parse(body);
                    r = result;
                } else {

                    r = body;
                }
                // Call callback with no error, and result of request
                resolve(r);

            } catch (e) {
                // Call callback with error
                reject(e);
            }


        });
    });
}


function callApi(req, res) {
    const app1 = new ApiAiApp({ request: req, response: res });
    var intent = app1.getIntent();
    // if (intent == "flight_id") {
    //     return callrestapi(zodiac).then(function (result1) {
    //         app1.ask("Flight is arrived. Actual Departs time is 7:44PM IST and Arrival time is 9:19PM IST. Scheduled Departs time is 9:10PM and arrival time is 10:10PM IST");
    //     });
    // }
    let flightdate = app1.getArgument('date').split('-');
    let flightno = app1.getArgument('any');
    let carrier = app1.getArgument('flight_names');
    //console.log(intent + "=>" + apid + "=>" + apkey + "=>" + carrier + "=>" + flightno + "=>" + flightdate[2] + "=>" + flightdate[1] + "=>" + flightdate[0]);
    if (intent == "flight_arriving_date") {
        return callrestapi(apid, apkey, carrier, flightno, flightdate[0], flightdate[1], flightdate[2]).then(function (result1) {
          
            var fligarriv = result1;
            if (fligarriv) {
            if(fligarriv.hasOwnProperty('error'))
            {
             console.log("sromojk");    
            app1.ask(fligarriv.error.errorMessage);
            }
             else   if (fligarriv.hasOwnProperty('appendix')) {
                    if (fligarriv.appendix.hasOwnProperty('airlines')) {
                        if (fligarriv.appendix.airlines[0].active) {
                            console.log(fligarriv.appendix.airlines[0].active);
                            if (fligarriv.appendix.hasOwnProperty('airports')) {
                                let source = fligarriv.appendix.airports[0];
                                let destination = fligarriv.appendix.airports[1];
                                let airports = source.name;
                                let citys = source.city;
                                let countrys = source.countryName;
                                let airportd = destination.name;
                                let latitude=destination.latitude;
                                let longitude=destination.longitude;
                                let sourcecarrier=fligarriv.flightStatuses[0].departureAirportFsCode;
                                let destcarrier=fligarriv.flightStatuses[0].arrivalAirportFsCode;
                                let cityd = destination.city;
                                let countryd = destination.countryName;
                                let flightstatuses = fligarriv.flightStatuses[0].status;
                                let datedep=fligarriv.flightStatuses[0].operationalTimes.estimatedGateDeparture.dateLocal.split('T')[0];
                                let datearr=fligarriv.flightStatuses[0].operationalTimes.estimatedGateArrival.dateLocal.split('T')[0];
                                let scheduledd=fligarriv.flightStatuses[0].operationalTimes.scheduledGateArrival.dateLocal.split('T')[1];
                                let scheduleda=fligarriv.flightStatuses[0].operationalTimes.scheduledGateDeparture.dateLocal.split('T')[1];
                                let estimatedd=fligarriv.flightStatuses[0].operationalTimes.estimatedGateDeparture.dateLocal.split('T')[1];
                                let estimateda=fligarriv.flightStatuses[0].operationalTimes.estimatedGateArrival.dateLocal.split('T')[1];
                                var newflightss;
//                                 for (var property in flightstatus) {
//                                     if(property==flightstatuses)
//                                     {
//                                     newflightss=flightstatus[property];
//                                     }
// }
                                
var myKeys = Object.keys(flightstatus) 
newflightss=flightstatus[myKeys.indexOf(flightstatuses)!==-1?flightstatuses:""];
                                //app1.ask(`Flight is ${newflightss} from ${airports} ${countrys} to ${airportd} ${countryd}. Estimated Departure ${estimatedd} , Arrival ${estimateda}. Schedule Departure ${scheduledd} , Arrival ${scheduleda}. Do u want to know anything else?`);
//     app1.ask(app1.buildRichResponse()
//     // Create a basic card and add it to the rich response

//     .addSimpleResponse('Do you need anything else?')
//     .addBasicCard(app1.buildBasicCard(`**Departure:** \n\n${datedep}\n\n${scheduledd.substring(0, scheduledd.length-4)}\n *Est:* ${estimatedd.substring(0, estimatedd.length-4)} \n\n ${airports} \n\n**Arrival:** \n\n${datearr}\n\n${scheduleda.substring(0, scheduleda.length-4)}\n *Est:* ${estimateda.substring(0, estimateda.length-4)}\n\n${airportd}`)
//       .setTitle(`Flight Status ${sourcecarrier} => ${destcarrier}`)
//       .setImage(`https://www.dropbox.com/s/g7avz78npsqcm2n/flight647x404_101116021054.jpg?raw=1', 'Flight Status`)
//     )
//   );              
//===========================================                                
  app1.askWithList(app1.buildRichResponse()
    .addSimpleResponse({displayText:'Do you want to know anything else?',speech:`Flight is ${newflightss} from ${airports} ${countrys} to ${airportd} ${countryd}. Estimated Departure ${estimatedd.substring(0, estimatedd.length-4)} , Arrival ${estimateda.substring(0, estimateda.length-4)}. Schedule Departure ${scheduledd.substring(0, scheduledd.length-4)} , Arrival ${scheduleda.substring(0, scheduleda.length-4)}. Do u want to know anything else?`})
                   
    .addSuggestions(['Yes', 'No']),
    app1.buildList('Flight Status')
    // Add the first item to the list
    .addItems(app1.buildOptionItem('option2')
      .setTitle(`D ${datedep}`)
      .setDescription(`${scheduledd.substring(0, scheduledd.length-4)}\n\nEst:${estimatedd.substring(0, estimatedd.length-4)}`)
       .setImage('https://www.dropbox.com/s/l1h4x5r6ox5f60q/rsz_departure.png?raw=1', 'Departure')
      )
    // Add the second item to the list
    .addItems(app1.buildOptionItem('option1')
      .setTitle(`A ${datearr}`)
      .setDescription(`${scheduleda.substring(0, scheduleda.length-4)}\n\nEst:${estimateda.substring(0, estimateda.length-4)}`)
      .setImage('https://www.dropbox.com/s/mcw8pgxq5akdn0v/rsz_arrival.png?raw=1', 'Arrival')
    ).addItems(app1.buildOptionItem('option3').setTitle(`${sourcecarrier} => ${destcarrier}`)
      .setDescription(`${airports} - ${airportd}`)
    )
  );
 //=====================================================

//  app1.ask(app1.buildRichResponse()
//     // Create a basic card and add it to the rich response

//     .addSimpleResponse(`Flight is ${newflightss} from ${airports} ${countrys} to ${airportd} ${countryd}. Estimated Departure ${estimatedd.substring(0, estimatedd.length-4)} , Arrival ${estimateda.substring(0, estimateda.length-4)}. Schedule Departure ${scheduledd.substring(0, scheduledd.length-4)} , Arrival ${scheduleda.substring(0, scheduleda.length-4)}. Do u want to know anything else?`)
//     .addBasicCard(app1.buildBasicCard(`<center><b> ${sourcecarrier} => ${destcarrier} </b></center><table style="width:100%"><tr><td align="left"><b>Departure:</b> \n\n<b>${datedep}</b>\n${scheduledd.substring(0, scheduledd.length-4)}<br/><i>Est:</i>${estimatedd.substring(0, estimatedd.length-4)}</td><td><img src="https://www.dropbox.com/s/l1h4x5r6ox5f60q/rsz_departure.png?raw=1"/></td></tr><tr><td colspan="2"  align="center">${airports}</td></tr></table>
// \n<b>Arrival:</b><table width="100%"><tr><td align="left"><b>${datearr}</b><br/>${scheduleda.substring(0, scheduleda.length-4)} <br/><i>Est:</i>${estimateda.substring(0, estimateda.length-4)}</td><td><img src="https://www.dropbox.com/s/mcw8pgxq5akdn0v/rsz_arrival.png?raw=1"/></td></tr><tr><td colspan="2"  align="center">${airportd}</td></tr></table>`)
//       .setTitle('Flight Status')
//       .setImage('https://www.dropbox.com/s/g7avz78npsqcm2n/flight647x404_101116021054.jpg?raw=1')
//     )
//   );
//=========================================================                               

                     
                            }
                        }
                    }
                }
            
            }
           
         
        }).catch(function (errdata) {

        })
    }
}
apps.post("/", function (req, res) {
    callApi(req, res);
});
apps.listen(process.env.PORT || 3000, function () {

});
