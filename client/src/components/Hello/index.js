import React from 'react';
import bye from '../../public/image/bye.png';

export default function Hello({ name, id }) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#F5F9FF',
        marginBottom: 40,
        marginLeft: 46,
        marginRight: 46,
        height: 173,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 6,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 32
        }}
      >
        <img alt="bye" src={bye} height="100%" width={96} />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 6,
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <p
          style={{
            fontSize: 30
          }}
        >
          Hello, {name}{' '}
        </p>
        <p
          style={{
            fontSize: 14
          }}
        >
          ID : {id}
        </p>
      </div>
    </div>
  );
}
