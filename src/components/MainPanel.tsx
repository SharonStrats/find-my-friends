import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PersonDetails, fetchPersonDetails } from 'solid-friend-helpers';
import { LocationDetails } from './LocationDetails';
interface Props {
  webId?: string;
}
//Look at instead of refetching looking in Document Cache...
export const MainPanel: React.FC<Props> = () => {
  const params = useParams<{ webId: string }>();
  const webId = decodeURIComponent(params.webId);
  let [details, setDetails] = React.useState<PersonDetails | null | undefined>({
    webId: '',
    avatarUrl: null,
    fullName: null,
    follows: null,
    personType: null
  });
  console.log({ params, webId });

  useEffect(() => {
    const getDetails = async () => {
      await fetchPersonDetails(webId || null).then(setDetails);
    };
    getDetails();
  }, []);

  console.log('Person', details, webId);
  const personView = details ? (
    <FullPersonView details={details} />
  ) : (
    <code>{webId}</code>
  );
  return <>{personView}</>;
};

const FullPersonView: React.FC<{ details: PersonDetails }> = ({ details }) => {
  if (details.personType === null) {
    return <>(loading {details.webId})</>;
  }
  const photo = (
    <>
      <figure className='media-left'>
        <p className='image is-64x64'>
          <img
            src={details.avatarUrl || '/img/default-avatar.png'}
            alt='Avatar'
            className='is-rounded'
          />
        </p>
      </figure>
    </>
  );

  return (
    <>
      <header className='card-header'>
        <div className='card-header-title'>
          {photo}
          <div>
            <Link
              to={`/profile/${encodeURIComponent(details.webId)}`}
              title="View this person's friends"
            >
              {details.fullName}
            </Link>
          </div>
        </div>
      </header>
      <div className='card-content'>
        <div className='content'>
          <LocationDetails webId={details.webId} />
        </div>
      </div>
    </>
  );
};
