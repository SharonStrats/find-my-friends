import React from 'react';
import { Route } from 'react-router';
import { LogoutButton } from '@solid/react';
import { Friends } from './Friends';
import { CurrentUser } from './CurrentUser';
import { FriendRequestButton } from './FriendRequest';
import { Search } from './Search';
import { MainPanel } from './MainPanel';

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
        <section className='main-content columns is-fullheight'>
          <aside className='column is-4 is-narrow-mobile is-fullheight section is-hidden-mobile'>
            <Search
              onSelect={(webId: string) => {
                window.location.href = `/profile/${encodeURIComponent(webId)}`;
              }}
            />
            <h1>Friends</h1>
            <Friends />
          </aside>
          <Route path='/profile/:webId'>
            <div className='container column is-8'>
              <div className='section'>
                <div className='card'>
                  <MainPanel />
                </div>
              </div>
            </div>
          </Route>
        </section>
      </div>
    </>
  );
};
