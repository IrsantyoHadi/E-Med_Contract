import React from 'react';

import Doctors from '../../public/image/doctors.png';

export default function Welcome() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 50
      }}
    >
      <img alt="Welcome" src={Doctors} height={201} width={334} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: 30
        }}
      >
        <p>Welcome to</p> <div style={{ width: 10 }} />{' '}
        <p style={{ fontWeight: 'bold' }}>XELL</p>
        <p style={{ color: '#3A86FF', fontWeight: 'bold' }}>DOC</p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          marginTop: 12
        }}
      >
        <p
          style={{
            fontWeight: 400,
            fontSize: 14,
            color: '#807F7F'
          }}
        >
          Xelldoc is a blockchain-based health platform that connects patients
          with various health facilities with an application.
        </p>
      </div>
    </div>
  );
}
