import React, { useEffect } from 'react';
import { useWebId } from '@solid/react';
import { PersonSummary } from './PersonLists'; //need to change this...
import { fetchPersonDetails, PersonDetails } from 'solid-friend-picker';

export const CurrentUser: React.FC<{}> = () => {
  const myWebId = useWebId() || null;
  let [myPersonDetails, setPersonDetals] = React.useState<
    PersonDetails | null | undefined
  >({
    webId: '',
    avatarUrl: null,
    fullName: null,
    follows: null,
    personType: null
  });

  // const myWebId = useWebId();
  useEffect(() => {
    (async () => {
      myPersonDetails = await fetchPersonDetails(myWebId);
      console.log('Person Details: ' + JSON.stringify(myPersonDetails));
      setPersonDetals(myPersonDetails);
    })();
  }, []);

  if (myPersonDetails) {
    return (
      <div className='navbar-start'>
        You: <PersonSummary details={myPersonDetails} />
      </div>
    );
  }
  if (myWebId) {
    return (
      <div className='navbar-start'>
        You: <code>{myWebId}</code>>
      </div>
    );
  }
  return <div className='navbar-start'>(loading your profile...)</div>;
};
