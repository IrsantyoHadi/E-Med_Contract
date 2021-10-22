import React from 'react';

export default function History({
  medicalRecords,
  setModalShow,
  setSelectedRecord
}) {
  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    var time = date + ' ' + month + ' ' + year;
    return time;
  };
  return (
    <div>
      <div>
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>Consultation History</p>
      </div>
      <div>
        {medicalRecords.length > 0 &&
          medicalRecords.map((record) => {
            return (
              <div
                onClick={() => {
                  setModalShow(true);
                  setSelectedRecord(record);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 5
                }}
                onMouseEnter={(event) => {
                  event.target.style.cursor = 'pointer';
                }}
                onMouseLeave={(event) => {
                  event.target.style.cursor = 'default';
                }}
              >
                <div style={{ flex: 3 }}>
                  {record.doctorName ? record.doctorName : 'Dr. Fulan'}
                </div>
                <div style={{ flex: 6 }}>{record.assesment}</div>
                <div style={{ flex: 3 }}>{timeConverter(record.examDate)}</div>
              </div>
            );
          })}
        {medicalRecords.length === 0 && <h3>No Record</h3>}
      </div>
    </div>
  );
}
