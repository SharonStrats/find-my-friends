import React from 'react';
import { LogoutButton } from '@solid/react';
import { Friends } from './Friends';
import { CurrentUser } from './CurrentUser';
import { FriendRequestButton } from './FriendRequest';
//import { Search } from '@inrupt/solid-react-components';

//Search needs typescript file
//Need to add Search from 'solid-react-components
//Need to add location in the main page to see the users location
//thinking about including a map
export const LoggedInView: React.FC<{}> = () => {
  // const myWebId = useWebId();

  return (
    <>
      <div className='container'>
        <nav className='navbar has-shadow'>
          <CurrentUser />
          <div className='navbar-end'>
            <div className='navbar-item'></div>
            <div className='navbar-item'>
              <FriendRequestButton />
              <LogoutButton className='button is-primary' />
            </div>
          </div>
        </nav>
        <Friends />
      </div>
    </>
  );
};
