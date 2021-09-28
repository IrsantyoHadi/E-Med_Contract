/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';

export default function ListPatient({ drizzle, drizzleState }) {
  const [dataPatients, setDataPatients] = useState([]);
  const [patientAddress, setPatientAddress] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
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
          let examSchedule;
          switch (el.examSchedule) {
            case '0':
              examSchedule = 'monday';
              break;
            case '1':
              examSchedule = 'tuesday';
              break;
            case '2':
              examSchedule = 'wednesday';
              break;
            case '3':
              examSchedule = 'thursday';
              break;
            case '4':
              examSchedule = 'friday';
              break;
            case '5':
              examSchedule = 'saturday';
              break;
            default:
              break;
          }
          return {
            examSchedule,
            patientAddress: el.patientAddress,
            active: el.active,
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
              <Card key={idx}>
                <Card.Body>
                  <Card.Title>{patient.patientAddress}</Card.Title>
                  <Card.Text>Scheduled for : {patient.examSchedule}</Card.Text>
                  <Button
                    onClick={() => {
                      setPatientAddress(patient.patientAddress);
                      setModalShow(true);
                    }}>
                    DETAIL
                  </Button>
                </Card.Body>
              </Card>
            </>
          );
        }
      })}
      {modalShow && (
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          patientAddress={patientAddress}
          emed={emed}
          modalShow2={() => setModalShow2(true)}
        />
      )}
      {modalShow2 && (
        <MyVerticallyCenteredModal2
          show={modalShow2}
          onHide={() => setModalShow2(false)}
          patientAddress={patientAddress}
          emed={emed}
          drizzleState={drizzleState}
        />
      )}
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  const { patientAddress, emed } = props;
  const [detail, setDetail] = useState({
    name: '',
    dob: '',
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
      'Dec',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  };

  const getDetailPatient = async () => {
    emed.methods
      .getPatientDetail(patientAddress)
      .call()
      .then((data) => {
        let dataWanted = {
          name: data.name,
          dob: timeConverter(data.dob),
        };

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
      centered>
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
      )}

      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide();
            props.modalShow2();
          }}>
          Add New Medical Record
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function MyVerticallyCenteredModal2(props) {
  const { patientAddress, emed, drizzleState } = props;
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
    const {
      subject,
      object,
      assessment,
      planning,
      weight,
      height,
      systole,
      diastole,
      date,
      location,
    } = dataToSend;
    emed.methods
      .addMedicalRecord(
        patientAddress,
        subject,
        object,
        assessment,
        planning,
        +weight,
        +height,
        +systole,
        +diastole,
        date,
        location
      )
      .send({
        from: drizzleState.accounts[0],
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
      controlId: 'subject',
    },
    {
      label: 'Object',
      controlId: 'object',
    },
    {
      label: 'Assessment',
      controlId: 'assessment',
    },
    {
      label: 'Planning',
      controlId: 'planning',
    },
    {
      label: 'Weight',
      controlId: 'weight',
    },
    {
      label: 'Height',
      controlId: 'height',
    },
    {
      label: 'Systole',
      controlId: 'systole',
    },
    {
      label: 'Diastole',
      controlId: 'diastole',
    },
    {
      label: 'Date',
      controlId: 'date',
      type: 'date',
    },
    {
      label: 'Location',
      controlId: 'location',
    },
  ];

  return (
    <Modal
      {...props}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
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
