import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, Modal } from 'react-bootstrap';
import SideBar from '../components/Sidebar';
import Balance from '../components/Balance';
import History from '../components/History';
import Hello from '../components/Hello';

function StartingPage({ drizzle, drizzleState }) {
  const [user, setUser] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const history = useHistory();
  const irsToken = drizzle.contracts.IRSTKN;
  const emed = drizzle.contracts.Emed;
  const [medicalRecord, setMedicalRecord] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const getMedicalRecord = async () => {
    emed.methods
      .userGetOwnMedicalRecords()
      .call()
      .then((data) => {
        console.log(data, 'ini data medical recordnya');
        let reverseArray = [...data].reverse();
        setMedicalRecord(reverseArray);
      });
  };

  useEffect(() => {
    emed.methods
      .checkUser()
      .call()
      .then((data) => {
        if (data.name === '') {
          history.push('/registration');
        } else {
          console.log(data, 'ini datannya');
          setUser(data);
        }
      });
  }, [drizzleState]);

  useEffect(() => {
    irsToken.methods
      .balanceOf(drizzleState.accounts[0])
      .call()
      .then((data) => {
        setBalance(data);
      });

    getMedicalRecord();
  }, [user]);

  const validateDoctor = () => {
    if (doctorAddress) {
      emed.methods
        .validateDoctor(doctorAddress)
        .send({
          from: drizzleState.accounts[0]
        })
        .then((data) => {
          alert('Success');
        });
    }
  };

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
    <>
      {user && <SideBar userType={user.userType} />}
      <div className="main-wrapper">
        <div className="main-content">
          <div>
            {user && <Hello name={user.name} id={user.walletAddress} />}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div className="registration-box">
                {user && <Balance userType={user.userType} balance={balance} />}
              </div>
              <div className="registration-box">
                {user && user.userType === '1' && (
                  <History
                    setModalShow={setModalShow}
                    medicalRecords={medicalRecord}
                    setSelectedRecord={setSelectedRecord}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalShow && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          backdrop="static"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Medical Record
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecord && (
              <div>
                <h5>
                  Examination Date : {timeConverter(selectedRecord.examDate)}
                </h5>
                <ul>
                  <li>Doctor Name : {selectedRecord.doctorName}</li>
                  <li>Subjective : {selectedRecord.subjective}</li>
                  <li>Assesment : {selectedRecord.assesment}</li>
                  <li>Planning : {selectedRecord.planning}</li>
                  <li>Doctor Notes: {selectedRecord.doctor_notes} </li>
                </ul>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default StartingPage;
