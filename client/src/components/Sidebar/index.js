/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react';

import './sidebar.css';
import './utilities.css';

import Profile from './profile';
import MenuItem from './menuItem';

export default function SideBar({ activeMenu, userType }) {
  const [menus, setMenus] = useState([
    {
      title: 'My Profile',
      path: '/',
      icon: 'user',
      active: true
    }
  ]);

  useEffect(() => {
    if (userType === '1') {
      setMenus(
        menus.concat([
          {
            title: 'Find Doctor',
            path: '/list',
            icon: 'search',
            active: false
          }
        ])
      );
    } else {
      setMenus(
        menus.concat([
          {
            title: 'My Patient',
            path: '/list',
            icon: 'search',
            active: false
          }
        ])
      );
    }
  }, [userType]);

  return (
    <section className="sidebar">
      <div className="content pt-50 pb-30 ps-30">
        <Profile />
        <div className="menus">
          {menus.map((menu) => (
            <MenuItem
              title={menu.title}
              path={menu.path}
              icon={menu.icon}
              active={menu.title === activeMenu}
              key={menu.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
