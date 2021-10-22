/* eslint-disable no-loop-func */
import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Modal, Form, Container } from 'react-bootstrap';
import dokter from '../public/image/dokterindia.png';
import { addNew, getData } from '../utils/firebase';
import MsgFrom from './ChatBox/from';
import MsgTo from './ChatBox/to';

export default function ListDoctor({ drizzle, drizzleState, patientAddress }) {
  const [dataDoctors, setDataDoctors] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const emed = drizzle.contracts.Emed;
  useEffect(() => {
    getDataDoctors();
  }, [drizzleState]);

  const getDataDoctors = async () => {
    let dataDoctor;
    let counter = 0;
    let dataWanted = [];
    do {
      await emed.methods
        .validDoctors(counter)
        .call()
        .then(async (data) => {
          dataDoctor = data;
          dataWanted.push({
            name: data.name,
            fee: data.doctorFee,
            walletAddress: data.walletAddress
          });
          counter++;
        })
        .catch((err) => {
          dataDoctor = false;
          setDataDoctors(dataWanted);
        });
    } while (dataDoctor);
  };

  const createNewChatRoom = async (doctorAddress) => {
    addNew(
      'Halo, selamat datang di XELLDOC',
      doctorAddress,
      `${doctorAddress}${patientAddress}`
    );
  };

  const createAppointment = async (doctorAddress) => {
    emed.methods
      .createAppointment(doctorAddress)
      .send({
        from: drizzleState.accounts[0]
      })
      .then(() => {
        createNewChatRoom(doctorAddress);
        setModalShow(true);
      })
      .catch((err) => {
        console.log(err, 'INI ADA ERROR');
      });
  };

  return (
    <>
      {dataDoctors.map((doctor, idx) => {
        return (
          <>
            <Card
              style={{
                maxHeight: 293,
                width: 264,
                marginLeft: 15,
                marginBottom: 10
              }}
              key={doctor.walletAddress}
            >
              <Card.Body
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{ marginBottom: 5 }}>
                  <img alt="dokter" src={dokter} />
                </div>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Text>General Practicioner</Card.Text>
                <Card.Text>Consultation Fee : {doctor.fee}</Card.Text>
                <Button
                  onClick={() => {
                    createAppointment(doctor.walletAddress);
                    setDoctor(doctor);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#3A86FF'
                  }}
                >
                  Start Consultation
                </Button>
              </Card.Body>
            </Card>
          </>
        );
      })}
      {modalShow && (
        <ChatModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          patientAddress={patientAddress}
          doctorAddress={doctor.walletAddress}
          doctor={doctor}
        />
      )}
    </>
  );
}

function ChatModal(props) {
  const { doctorAddress, patientAddress, doctor } = props;
  const [messages, setMessage] = useState([]);
  const [msg, setMsg] = useState('');
  const endMessage = useRef();

  useEffect(() => {
    getData(setMessage, `${doctorAddress}${patientAddress}`);
  }, []);

  useEffect(() => {
    if (endMessage.current) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = () => {
    addNew(msg, patientAddress, `${doctorAddress}${patientAddress}`);
    setMsg('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    endMessage.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Modal
      {...props}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      scrollable={true}
      size="xl"
      style={{ height: '80vh' }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div
            style={{
              padding: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <img alt="dokter" src={dokter} height={56} width={56} />
            <div style={{ marginLeft: 30 }}>
              <p>{doctor.name}</p>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 10
        }}
      >
        {messages.map((msg) => {
          if (msg.from === doctorAddress) {
            return <MsgFrom message={msg.message} />;
          }
          return <MsgTo message={msg.message} />;
        })}
        <div ref={endMessage} />
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', flexDirection: 'row' }}>
        <input
          style={{ flex: 11, borderRadius: 5, borderColor: 'gray' }}
          placeholder="Enter Your Message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button
          style={{ flex: 1, backgroundColor: '#3A86FF', borderRadius: 5 }}
          onClick={handleSubmit}
        >
          Send
        </button>
      </Modal.Footer>
    </Modal>
  );
}
