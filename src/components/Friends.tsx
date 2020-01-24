import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchConnections, PersonDetails, PersonType } from 'solid-user-search';

type FriendProps = {
  details: PersonDetails;
};
type FriendsProps = {
  friends: PersonDetails[];
};
export const PersonSummary: React.FC<FriendProps> = props => {
  const details = props.details;
  const photo = (
    <>
      <div className='media-right'>
        <figure className='card-header-title'>
          <p className='image is-48x48'>
            <img
              src={details.avatarUrl || '/img/default-avatar.png'}
              alt='Avatar'
              className='is-rounded'
            />
          </p>
        </figure>
      </div>
    </>
  );

  return (
    <div>
      <Link
        to={`/profile/${encodeURIComponent(details.webId)}`}
        title="View this person's friends"
      >
        <div className='media'>
          {photo}
          <div className='media-content'>
            <div className='media-left'>{details.fullName}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const FriendCard = (props: FriendProps): React.ReactElement => {
  /*      <h5>{props.location}</h5>
      <h6>
        Lat: {props.latitude} Lon: {props.longitude}
      </h6> */
  return (
    <div key={props.details.webId} className='card'>
      <PersonSummary details={props.details} />
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
    return <FriendCard details={friend} />;
  });
  return <div className='friend-list'>{friends}</div>;
};
export const Friends: React.FC<{}> = () => {
  let [friends, setFriends] = React.useState<PersonDetails[]>([]);

  // const myWebId = useWebId();
  useEffect(() => {
    (async () => {
      let generator = fetchConnections([PersonType.friend]);

      for await (let friends of generator) {
        setFriends(friends);
      }
    })();
  }, []);

  return (
    <>
      <div>
        <FriendCardList friends={friends} />
      </div>
    </>
  );
};
