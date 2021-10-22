import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, Modal } from 'react-bootstrap';
import SideBar from '../components/Sidebar';
import ListDoctor from '../components/ListDoctor';
import ListPatient from '../components/ListPatient';

function ListPage({ drizzle, drizzleState }) {
  const [user, setUser] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [doctorAddress, setDoctorAddress] = useState('');
  const emed = drizzle.contracts.Emed;
  const history = useHistory();

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

  return (
    <>
      {user && <SideBar userType={user.userType} />}
      {user && (
        <div className="main-wrapper">
          <div className="main-content">
            <div
              style={{
                padding: 20,
                flexWrap: 'wrap',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              {user && user.userType === '1' && (
                <ListDoctor
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  patientAddress={user.walletAddress}
                />
              )}

              {user && user.userType === '0' && (
                <ListPatient
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  doctorAddress={user.walletAddress}
                />
              )}
            </div>
          </div>
        </div>
      )}
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
          <Modal.Body>"KOSONG"</Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default ListPage;
