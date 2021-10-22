import React from 'react';

export default function ChatFrom({ message }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        maxWidth: '40%',
        padding: 14,
        backgroundColor: '#E3EEFF',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 15,
        alignSelf: 'flex-start'
      }}
    >
      {message}
    </div>
  );
}
