import React from 'react';
import { Link } from 'react-router-dom';
import { PersonDetails } from 'solid-friend-picker';

interface PersonProps {
  details: PersonDetails;
}
export const PersonSummary: React.FC<PersonProps> = props => {
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
