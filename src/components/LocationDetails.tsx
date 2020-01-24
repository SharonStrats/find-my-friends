import React, { useEffect } from 'react';
import {
  fetchDocument,
  TripleDocument,
  TripleSubject,
  Reference
} from 'tripledoc';
import { solid, schema } from 'rdf-namespaces';
import openstreetmap from '../api/openstreetmap';

type LocationData = {
  latitude: String | Date | Number | null;
  longitude: String | Date | Number | null;
  place: String | null;
};
async function getLocationDocument(locationListEntry: TripleSubject) {
  try {
    let locationListUrl = await locationListEntry.getNodeRef(solid.instance);

    try {
      if (locationListUrl) {
        return await fetchDocument(locationListUrl);
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
}

async function selectAuthorizedLocationDoc(profile: TripleSubject) {
  //First attempt will be making it public, but really
  //want to make it private
  /*  
        Subject            Predicate                Object
        #location          rdf:type                 solid:TypeRegistration
        #location          solid:forClass           schema:GeoCoordinates
        #location          solid:instance           /public/location.ttl
    */
  const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
  console.log('publicTypeIndexUrl' + JSON.stringify(publicTypeIndexUrl));
  try {
    if (publicTypeIndexUrl) {
      const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);

      const locationListEntries = publicTypeIndex.findSubjects(
        solid.forClass,
        schema.GeoCoordinates
      );

      console.log('locationentries length ' + locationListEntries.length);
      if (locationListEntries.length >= 0) {
        try {
          //Detail
          console.log('in detail');
          return await getLocationDocument(locationListEntries[0]);
        } catch (err) {
          console.log(err);
          try {
            //Approximate
            return await getLocationDocument(locationListEntries[1]);
          } catch (err) {
            console.log(err);
            try {
              //General
              return await getLocationDocument(locationListEntries[2]);
            } catch (err) {
              console.log(err);
            }
          }
        }
      } else {
        return undefined;
      }
    }
  } catch (err) {
    console.log(err);
  }
}
const getPlace = async (
  latitude: String | Date | Number | null,
  longitude: String | Date | Number | null
): Promise<string | null> => {
  const response = await openstreetmap.get('/reverse', {
    params: { format: 'geocodejson', lat: latitude, lon: longitude }
  });

  return response.data.features[0].properties.geocoding.label;
};

const getLocation = async (webId: string) => {
  let locationDoc: TripleDocument | undefined = undefined;
  const webIdDoc = await fetchDocument(webId);
  const profile = webIdDoc.getSubject(webId);
  let locationData: LocationData = { latitude: 0, longitude: 0, place: '' };
  //profile is getting set because it is finding the URL
  //from selectAuthorized..

  try {
    locationDoc = await selectAuthorizedLocationDoc(profile);
    console.log('locaiton doc ' + locationDoc);
    try {
      if (locationDoc) {
        let locRef: Reference = 'http://schema.org/GeoCoordinates';
        const locationSubject: TripleSubject[] = await locationDoc.getSubjectsOfType(
          locRef
        );
        let latitude = locationSubject[0].getLiteral(schema.latitude); //returning null
        let longitude = locationSubject[0].getLiteral(schema.longitude); //returning null
        try {
          let place: string | null = await getPlace(latitude, longitude);
          locationData = {
            latitude: latitude,
            longitude: longitude,
            place: place
          };
          return { latitude, longitude, place };
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
export const LocationDetails: React.FC<{ webId: string }> = ({ webId }) => {
  const [locationData, setLocationData] = React.useState<
    LocationData | undefined
  >({
    latitude: 0,
    longitude: 0,
    place: null
  });
  useEffect(() => {
    let findLocation = async () => {
      await getLocation(webId).then(setLocationData);
    };

    findLocation();
  });

  return (
    <>
      <div>
        <p>
          {locationData?.latitude} {locationData?.longitude}
        </p>
        <p>Is at {locationData?.place}</p>
      </div>
    </>
  );
};
