const REQUEST =
`    <REQUEST>
      <LOGIN authenticationkey="86a386036d754ec2a8f4ff6b62ad7b0f" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.5" orderby="AdvertisedTimeAtLocation" limit="10">
        <FILTER>
          <AND>
            <EQ name="LocationSignature" value="Cst" />
            <EQ name="ToLocation.LocationName" value="U"/>
            <GT name="AdvertisedTimeAtLocation" value="\$now" />
            <EQ name="ActivityType" value="Avgang" />
          </AND>
        </FILTER>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>Deviation.Description</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>Canceled</INCLUDE>
        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
      </QUERY>
    </REQUEST>`

import axios from 'axios'
const config = {
     headers: {'Content-Type': 'application/xml'}
}

axios.post('https://api.trafikinfo.trafikverket.se/v2/data.json', REQUEST, config)
.then((res) => {
  let departures = res.data.RESPONSE.RESULT[0].TrainAnnouncement
  departures = format(departures)
  departures.forEach(function(departure: string) {
    console.log(departure);
  })
})
.catch((error) => {
  console.error(error)
})

function format(departures) {
  const result = departures.map(function(departure): string {
    const deviations = formatDeviations(departure.Deviation)
    const canceled = departure.Canceled
    const estimatedTime = formatDate(departure.EstimatedTimeAtLocation)

    return `${formatDate(departure.AdvertisedTimeAtLocation)} | Spår ${departure.TrackAtLocation} ${deviations ? "| " + deviations : ""} ${canceled == true ? "| Inställd avgång" : ""} ${estimatedTime ? "| Ny tid: " + estimatedTime : ""}`
  })
  return result
}

function formatDeviations(deviations): string {
  if(deviations) {
    return deviations.map(function(deviation): string{
      return deviation.Description
    }).join()
  }else {
    return null
  }
}

function formatDate(date: string): string {
  if(date){
    return date.substr(date.indexOf("T") + 1, 5)
  }
}
