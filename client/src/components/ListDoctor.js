/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';

export default function ListDoctor({ drizzle, drizzleState }) {
  const [dataDoctors, setDataDoctors] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [doctorAlamat, setDoctorAddress] = useState(null);
  const [modalShow, setModalShow] = useState(false);
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
          let schedule = await getSchedule(data.walletAddress);
          dataDoctor = data;
          dataWanted.push({
            name: data.name,
            fee: data.doctorFee,
            walletAddress: data.walletAddress,
            schedule,
          });
          counter++;
        })
        .catch((err) => {
          dataDoctor = false;
          setDataDoctors(dataWanted);
        });
    } while (dataDoctor);
  };

  const getSchedule = async (doctorAddress) => {
    let schedule = [];
    let counter = 0;
    let flag;
    do {
      await emed.methods
        .doctor_schedule(doctorAddress, counter)
        .call()
        .then((data) => {
          flag = data;
          schedule.push(data);
          counter++;
        })
        .catch((err) => {
          flag = false;
        });
    } while (flag);

    schedule = schedule.map((el) => {
      switch (el) {
        case '0':
          return 'Monday';
        case '1':
          return 'Tuesday';
        case '2':
          return 'Wednesday';
        case '3':
          return 'Thursday';
        case '4':
          return 'Friday';
        case '5':
          return 'Saturday';
        default:
          return '';
      }
    });
    return schedule.join(',');
  };

  const createAppointment = async (data) => {
    if (data) {
      let examDate = Math.round(new Date().getTime() / 1000);
      emed.methods
        .createAppointment(doctorAlamat, examDate, data)
        .send({
          from: drizzleState.accounts[0],
        })
        .then(() => {
          return emed.methods
            .createAppointment(doctorAlamat, examDate, data)
            .call();
        })
        .then((dataAntrian) => {
          alert(`Ini Nomer Antrian Anda ${dataAntrian}`);
          setModalShow(false);
        });
    }
  };

  return (
    <>
      {dataDoctors.map((doctor, idx) => {
        return (
          <>
            <Card key={doctor.walletAddress}>
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Text>Doctor Fee : {doctor.fee}</Card.Text>
                <Card.Text>Doctor Schedule : {doctor.schedule}</Card.Text>
                <Button
                  onClick={() => {
                    setModalShow(true);
                    setDoctorSchedule(doctor.schedule);
                    setDoctorAddress(doctor.walletAddress);
                  }}>
                  Create Appointment
                </Button>
              </Card.Body>
            </Card>
          </>
        );
      })}
      {modalShow && (
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          createAppointment={createAppointment}
          schedule={doctorSchedule}
        />
      )}
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  const [day, setDay] = useState(null);
  return (
    <Modal
      {...props}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Appointment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Schedule</Form.Label>
            <Form.Select
              onChange={(e) => {
                setDay(e.target.value);
              }}
              aria-label="Default select example">
              <option>Select Avalaible Day</option>
              {props.schedule.split(',').map((day, idx) => (
                <option value={idx + 1}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.createAppointment(day)}>Book!</Button>
      </Modal.Footer>
    </Modal>
  );
}
