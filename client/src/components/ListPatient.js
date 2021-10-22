/* eslint-disable no-loop-func */
import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';

import { addNew, getData } from '../utils/firebase';
import MsgFrom from './ChatBox/from';
import MsgTo from './ChatBox/to';

export default function ListPatient({ drizzle, drizzleState, doctorAddress }) {
  const [dataPatients, setDataPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [patientAddress, setPatientAddress] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);
  const emed = drizzle.contracts.Emed;

  useEffect(() => {
    getDataPatient();
  }, []);

  const getDataPatient = async () => {
    emed.methods
      .getPatientList()
      .call()
      .then((data) => {
        let dataToShow = data.map((el) => {
          return {
            patientAddress: el.patientAddress,
            active: el.active
          };
        });

        setDataPatients(dataToShow.reverse());
      });
  };

  return (
    <>
      {dataPatients.map((patient, idx) => {
        if (patient.active) {
          return (
            <>
              <Card
                style={{
                  maxHeight: 145,
                  width: 264,
                  marginLeft: 15,
                  marginBottom: 10
                }}
                key={idx}
              >
                <Card.Body>
                  <Card.Text>
                    {' '}
                    <p style={{ fontSize: 14, color: 'gray' }}>
                      {' '}
                      Patient ID : {patient.patientAddress}{' '}
                    </p>
                  </Card.Text>
                  <Button
                    onClick={() => {
                      setPatientAddress(patient.patientAddress);
                      setModalShow(true);
                    }}
                    style={{ backgroundColor: '#3A86FF', width: '100%' }}
                  >
                    Detail Patient
                  </Button>
                </Card.Body>
              </Card>
            </>
          );
        }
      })}
      {modalShow && (
        <DataPatientModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          patientAddress={patientAddress}
          emed={emed}
          modalShow2={() => setModalShow2(true)}
          modalShow3={() => setModalShow3(true)}
          setPatient={setPatient}
        />
      )}
      {modalShow2 && (
        <AddMedicalRecordModal
          show={modalShow2}
          onHide={() => setModalShow2(false)}
          patientAddress={patientAddress}
          emed={emed}
          drizzleState={drizzleState}
        />
      )}
      {modalShow3 && (
        <ChatModal
          show={modalShow}
          onHide={() => setModalShow3(false)}
          patientAddress={patientAddress}
          doctorAddress={doctorAddress}
          patient={patient}
        />
      )}
    </>
  );
}

function DataPatientModal(props) {
  const { patientAddress, emed, setPatient } = props;
  const [detail, setDetail] = useState({
    name: '',
    dob: ''
  });
  const [medicalRecord, setMedicalRecord] = useState([]);

  useEffect(() => {
    getDetailPatient();
    getMedicalRecord();
  }, [patientAddress]);

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

  const getDetailPatient = async () => {
    emed.methods
      .getPatientDetail(patientAddress)
      .call()
      .then((data) => {
        let dataWanted = {
          name: data.name,
          dob: timeConverter(data.dob)
        };
        setPatient(dataWanted);
        setDetail(dataWanted);
      });
  };

  const getMedicalRecord = async () => {
    emed.methods
      .doctorGetMedicalRecords(patientAddress)
      .call()
      .then((data) => {
        let reverseArray = [...data].reverse();
        setMedicalRecord(reverseArray);
      });
  };

  return (
    <Modal
      {...props}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Patient Detail
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p> Name : {detail.name}</p>
        <p> Dob : {detail.dob}</p>
      </Modal.Body>
      {medicalRecord.length > 0 && (
        <Modal.Body>
          <h3> Medical Records </h3>
          {medicalRecord.map((record) => {
            return (
              <div
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderStyle: 'solid',
                  padding: 10
                }}
              >
                <h5>Examination Date : {timeConverter(record.examDate)}</h5>
                <ul>
                  <li>Doctor Name : {record.doctorName}</li>
                  <li>Subjective : {record.subjective}</li>
                  <li>Assesment : {record.assesment}</li>
                  <li>Planning : {record.planning}</li>
                  <li>Doctor Notes: {record.doctor_notes} </li>
                </ul>
              </div>
            );
          })}
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button
          onClick={() => {
            props.modalShow3();
          }}
        >
          Start Chat
        </Button>
        <Button
          onClick={() => {
            props.onHide();
            props.modalShow2();
          }}
        >
          Add New Medical Record
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function AddMedicalRecordModal(props) {
  const { patientAddress, emed, drizzleState } = props;
  //       address _patientAddress,
  //       string memory _subjective,
  //       string memory _assesment,
  //       string memory _planning,
  //       string memory _doctorNotes,
  //       uint256 _examDate
  const addMedicalRecord = async (e) => {
    e.preventDefault();
    let dataToSend = {};
    for (let i = 0; i < e.target.length; i++) {
      const data = e.target[i];
      if (data.id && data.value !== '') {
        dataToSend[data.id] = data.value;
      }
    }
    dataToSend.date = new Date(dataToSend.date).getTime() / 1000;
    const { subject, assessment, planning, date, doctorNotes } = dataToSend;
    emed.methods
      .addMedicalRecord(
        patientAddress,
        subject,
        assessment,
        planning,
        doctorNotes,
        date
      )
      .send({
        from: drizzleState.accounts[0]
      })
      .then((data) => {
        props.onHide();
        alert('Success');
      })
      .catch((err) => {
        props.onHide();
        alert('Error');
      });
  };
  const formDetails = [
    {
      label: 'Subject',
      controlId: 'subject'
    },
    {
      label: 'Assessment',
      controlId: 'assessment'
    },
    {
      label: 'Planning',
      controlId: 'planning'
    },
    {
      label: 'Doctor Notes',
      controlId: 'doctorNotes'
    },
    {
      label: 'Date',
      controlId: 'date',
      type: 'date'
    }
  ];

  return (
    <Modal
      {...props}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new Medical Record
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={addMedicalRecord}>
        <Modal.Body>
          {formDetails.map((detail) => {
            return (
              <Form.Group className="mb-3" controlId={detail.controlId}>
                <Form.Label>{detail.label}</Form.Label>
                <Form.Control type={detail.type ? detail.type : 'text'} />
              </Form.Group>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function ChatModal(props) {
  const { doctorAddress, patientAddress, patient } = props;
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
    addNew(msg, doctorAddress, `${doctorAddress}${patientAddress}`);
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
            <div style={{ marginLeft: 30 }}>
              <p>{patient.name}</p>
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
          if (msg.from === patientAddress) {
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
