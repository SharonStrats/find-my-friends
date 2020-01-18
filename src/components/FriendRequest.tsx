import React, { useEffect } from 'react';
import { fetchPersonTypeLists, PersonDetails } from 'solid-friend-picker';
//This component should bring up all requestors for the solid user
//and allow them to accept the request..
export const FriendRequestButton = () => {
  let [requestors, setRequestors] = React.useState<PersonDetails | null>(null);
  useEffect(() => {
    (async () => {
      //need to explore do I need TypeLists.. or just an array of details...
      let generator = fetchPersonTypeLists();
      for await (let requestors of generator) {
        //setRequestors(requestors);
      }
    })();
  }, []);
  return (
    <>
      <button onClick={() => alert('Accept friendship')}>
        <img
          src='../../img/friend-search.svg'
          alt='Friend Requests'
          height='80'
          width='100'
        />
      </button>
    </>
  );
};
