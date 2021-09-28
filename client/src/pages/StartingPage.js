import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, Modal } from 'react-bootstrap';
import Header from '../components/Header';
import ListDoctor from '../components/ListDoctor';
import ListPatient from '../components/ListPatient';

function StartingPage({ drizzle, drizzleState }) {
  const [user, setUser] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const history = useHistory();
  const irsToken = drizzle.contracts.IRSTKN;
  const emed = drizzle.contracts.Emed;
  const [medicalRecord, setMedicalRecord] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const getMedicalRecord = async () => {
    emed.methods
      .userGetOwnMedicalRecords()
      .call()
      .then((data) => {
        let reverseArray = [...data].reverse();
        setMedicalRecord(reverseArray);
      });
  };

  const handleClick = () => {
    getMedicalRecord();
    setModalShow(true);
  };

  useEffect(() => {
    emed.methods
      .checkUser()
      .call()
      .then((data) => {
        if (data.name === '') {
          history.push('/registration');
        } else {
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
  }, [user]);

  const validateDoctor = () => {
    if (doctorAddress) {
      emed.methods
        .validateDoctor(doctorAddress)
        .send({
          from: drizzleState.accounts[0],
        })
        .then((data) => {
          alert('Success');
        });
    }
  };

  return (
    <>
      <Header />
      <Container>
        {user && user.userType === '1' && (
          <>
            <input
              style={{ marginRight: 10, marginLeft: 10 }}
              value={doctorAddress}
              onChange={(e) => {
                setDoctorAddress(e.target.value);
              }}
            />
            <Button onClick={validateDoctor}>ValidateDoctor</Button>
          </>
        )}
        <h1>Welcome to Emed </h1>
        {user && (
          <>
            <h3>Hai, {user.name}</h3>
            <h4>User Type : {user.userType === '0' ? 'Doctor' : 'Patient'}</h4>
            <h4>IRS Token Balance : {balance} IRS</h4>
          </>
        )}
        {user && user.userType === '1' && (
          <>
            <Button style={{ marginBottom: 20 }} onClick={handleClick}>
              My Record
            </Button>
            <ListDoctor drizzle={drizzle} drizzleState={drizzleState} />
          </>
        )}
        {user && user.userType === '0' && (
          <ListPatient drizzle={drizzle} drizzleState={drizzleState} />
        )}
      </Container>
      {modalShow && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          backdrop="static"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Medical Record
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {medicalRecord.map((records) => {
              return (
                <div
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderStyle: 'solid',
                  }}>
                  <h4>Last Exam : {records.examLocation}</h4>
                  {Object.entries(records).map((el) => {
                    if (
                      el[0] !== 'examLocation' &&
                      el[0] !== 'doctorAddress' &&
                      el[0] !== '0' &&
                      el[0] !== '1' &&
                      el[0] !== '2' &&
                      el[0] !== '3' &&
                      el[0] !== '4' &&
                      el[0] !== '5' &&
                      el[0] !== '6' &&
                      el[0] !== '7' &&
                      el[0] !== '8' &&
                      el[0] !== '9' &&
                      el[0] !== '10'
                    ) {
                      return (
                        <p>
                          {el[0]} = {el[1]}
                        </p>
                      );
                    }
                  })}
                </div>
              );
            })}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default StartingPage;
