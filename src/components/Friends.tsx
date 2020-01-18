import React, { useEffect } from 'react';
import {
  fetchConnections,
  PersonDetails,
  PersonType
} from 'solid-friend-helpers';

type FriendProps = {
  key: String;
  name: String | null;
};
type FriendsProps = {
  friends: PersonDetails[];
};
const FriendCard = (props: FriendProps) => {
  /*      <h5>{props.location}</h5>
      <h6>
        Lat: {props.latitude} Lon: {props.longitude}
      </h6> */
  return (
    <div className='card'>
      <h4>{props.key}</h4>
      <h5>{props.name}</h5>
    </div>
  );
};

const FriendCardList = (props: FriendsProps) => {
  if (!props.friends) {
    return <div>Loading... </div>;
  }
  const friends = props.friends.map((friend: PersonDetails) => {
    /*
        latitude={friend.latitude}
        longitude={friend.longitude}
        location={friend.location}  */
    return <FriendCard key={friend.webId} name={friend.fullName} />;
  });
  return <div className='friend-list'>{friends}</div>;
};
export const Friends: React.FC<{}> = () => {
  let [friends, setFriends] = React.useState<PersonDetails[]>([]);

  // const myWebId = useWebId();
  useEffect(() => {
    (async () => {
      let generator = fetchConnections([PersonType.me, PersonType.friend]);

      for await (let friends of generator) {
        console.log('Friends from app' + JSON.stringify(friends));
        setFriends(friends);
      }
    })();
  }, []);

  return (
    <>
      <div className='card'>
        <h3>Friends</h3>
        <FriendCardList friends={friends} />
      </div>
    </>
  );
};
