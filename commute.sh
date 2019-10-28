getRequest(){
  cat <<EOF
      <REQUEST>
        <LOGIN authenticationkey="86a386036d754ec2a8f4ff6b62ad7b0f" />
        <QUERY objecttype="TrainAnnouncement" schemaversion="1.5" orderby="AdvertisedTimeAtLocation" limit="5">
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
      </REQUEST>
EOF
}

curl -d "$(getRequest)" -X POST -H "Content-Type: application/xml" https://api.trafikinfo.trafikverket.se/v2/data.json | jq '.RESPONSE.RESULT | .[0].TrainAnnouncement'
