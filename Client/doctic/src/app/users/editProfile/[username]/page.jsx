'use client';
import React, { useState, useEffect } from 'react';
import {ChangeEmail} from './components/ChangeEmail';
import {ChangeUsername} from './components/ChangeUsername';
import {EditProfile} from './components/ChangeProfile';
import {ChangePassword} from './components/ChangePassword';
import {ChangeProfilePicture} from './components/ChangeProfilePicture';
import './page.css';

function App({ params }) {
  const [username, setUsername] = useState('');

  // ------- cambiar el valor de username desde URL cada vez que cambia el valor de params.username(users/[username]) --------
  useEffect(() => {
    if (params.username) {
      setUsername(params.username);
    }
  }, [params.username]);

  return (
    <div className="appEditProfile">
      <div className="edit-container">
        <div className='edit'>
          <EditProfile username={username}/>
        </div>
        <div className='edit'>
          <ChangeEmail username={username}/>
        </div>
        <div className='edit'>
          <ChangePassword username={username}/>
        </div>
      </div>
      <div className='edit-container'>
        <div className='edit'>
          <ChangeUsername username={username} />
        </div>
        <div className='edit'>
          <ChangeProfilePicture username={username} />
        </div>
      </div>
    </div>
  );
  
}

export default App; 
