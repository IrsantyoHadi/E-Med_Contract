import React from 'react';

export default function ChatTo({ message }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFCDF',
        maxWidth: '40%',
        padding: 14,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        marginBottom: 15,
        alignSelf: 'flex-end'
      }}
    >
      {message}
    </div>
  );
}
