import React from 'react';
import { ReactComponent as UserLogo } from '../../public/icon/user.svg';
import { ReactComponent as SearchLogo } from '../../public/icon/search.svg';
import { ReactComponent as SignOut } from '../../public/icon/log-out.svg';

export default function MenuItem({
  title = '',
  path = '/',
  icon,
  active = false
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 19.5,
        paddingBottom: 19.5
      }}
    >
      <div className="icon me-3">
        {icon === 'user' ? (
          <UserLogo />
        ) : icon === 'search' ? (
          <SearchLogo />
        ) : (
          <SignOut />
        )}
      </div>
      <div>
        <p className="item-title m-0">
          <a
            style={{ color: 'black' }}
            href={path}
            className="text-lg text-decoration-none"
          >
            {title}
          </a>
        </p>
      </div>
    </div>
  );
}
