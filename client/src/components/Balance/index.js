import React from 'react';

export default function Balance({ userType, balance }) {
  return (
    <div>
      <div>
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>Information</p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <p style={{ fontSize: 14, color: '##9A9A9A' }}>User Type</p>
        <p style={{ fontSize: 14, fontWeight: 'bold' }}>
          {userType === '1' ? 'Patient' : 'Doctor'}
        </p>
        <div></div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <p style={{ fontSize: 14, color: '##9A9A9A' }}>Token Balance</p>
        <p style={{ fontSize: 14, fontWeight: 'bold' }}>
          {balance ? balance : 0} XDC
        </p>
        <div></div>
      </div>
    </div>
  );
}
