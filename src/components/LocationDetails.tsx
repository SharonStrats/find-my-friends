import React from 'react';
import { fetchDocument, TripleDocument, TripleSubject } from 'tripledoc';
import { solid, schema } from 'rdf-namespaces';
import openstreetmap from '../api/openstreetmap';

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
  try {
    if (publicTypeIndexUrl) {
      const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);

      const locationListEntries = publicTypeIndex.findSubjects(
        solid.forClass,
        schema.GeoCoordinates
      );

      if (locationListEntries.length >= 0) {
        try {
          //Detail
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

const getFriends = async (webId: string) => {
  let locationDoc: TripleDocument | undefined = undefined;
  const webIdDoc = await fetchDocument(webId);
  const profile = webIdDoc.getSubject(webId);

  try {
    locationDoc = await selectAuthorizedLocationDoc(profile);
    try {
      if (locationDoc) {
        const location: TripleSubject = await locationDoc.getSubject(
          locationDoc.asRef()
        );
        console.log('Location: ' + JSON.stringify(location));
        let latitude = location.getLiteral(schema.latitude); //returning null
        let longitude = location.getLiteral(schema.longitude); //returning null
        try {
          let place: string | null = await getPlace(latitude, longitude);
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
  getFriends(webId);
  return (
    <>
      <div>Any content about a person you may want</div>
    </>
  );
};
