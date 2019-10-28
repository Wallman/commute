"use strict";
exports.__esModule = true;
var request = "    <REQUEST>\n      <LOGIN authenticationkey=\"86a386036d754ec2a8f4ff6b62ad7b0f\" />\n      <QUERY objecttype=\"TrainAnnouncement\" schemaversion=\"1.5\" orderby=\"AdvertisedTimeAtLocation\" limit=\"20\">\n        <FILTER>\n          <AND>\n            <EQ name=\"LocationSignature\" value=\"Cst\" />\n            <EQ name=\"ToLocation.LocationName\" value=\"U\"/>\n            <GT name=\"AdvertisedTimeAtLocation\" value=\"$now\" />\n            <EQ name=\"ActivityType\" value=\"Avgang\" />\n          </AND>\n        </FILTER>\n        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>\n        <INCLUDE>Deviation.Description</INCLUDE>\n        <INCLUDE>TrackAtLocation</INCLUDE>\n        <INCLUDE>Canceled</INCLUDE>\n        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>\n      </QUERY>\n    </REQUEST>";
var axios_1 = require("axios");
var config = {
    headers: { 'Content-Type': 'application/xml' }
};
axios_1["default"].post('https://api.trafikinfo.trafikverket.se/v2/data.json', request, config)
    .then(function (res) {
    var departures = res.data.RESPONSE.RESULT[0].TrainAnnouncement;
    departures = format(departures);
    departures.forEach(function (departure) {
        console.log(departure);
    });
})["catch"](function (error) {
    console.error(error);
});
function format(departures) {
    var result = departures.map(function (departure) {
        var deviations = departure.Deviation;
        if (deviations) {
            deviations.map(function (deviation) {
                return deviation.Description;
            }).join();
        }
        var canceled = departure.Canceled;
        var estimatedTime = departure.EstimatedTimeAtLocation;
        console.log(deviations);
        return formatDate(departure.AdvertisedTimeAtLocation) + " | Sp\u00E5r " + departure.TrackAtLocation + " " + (deviations ? "| " + deviations : "") + " " + (canceled == true ? "| Inställd avgång" : "");
    });
    return result;
}
function formatDate(date) {
    return date.substr(date.indexOf("T") + 1, 5);
}
