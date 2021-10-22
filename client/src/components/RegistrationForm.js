import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import PatientImage from '../public/icon/patient.png';
import { ReactComponent as DoctorLogo } from '../public/image/doctor.svg';

export default function RegistrationForm({ getDataToSend }) {
  const [userType, setUserType] = useState({
    doctor: false,
    patient: true
  });
  const [sched, setSched] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false
  });
  const handleChecked = (e) => {
    const target = e.target;
    const id = target.id;
    if (id === 'userType') {
      if (target.value === 'doctor') {
        setUserType({
          doctor: true,
          patient: false
        });
      } else {
        setUserType({
          patient: true,
          doctor: false
        });
        setSched({
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false
        });
      }
    }
    if (id === 'schedule') {
      switch (target.value) {
        case 'monday':
          setSched({
            ...sched,
            monday: !sched.monday
          });
          break;
        case 'tuesday':
          setSched({
            ...sched,
            tuesday: !sched.tuesday
          });
          break;
        case 'wednesday':
          setSched({
            ...sched,
            wednesday: !sched.wednesday
          });
          break;
        case 'thursday':
          setSched({
            ...sched,
            thursday: !sched.thursday
          });
          break;
        case 'friday':
          setSched({
            ...sched,
            friday: !sched.friday
          });
          break;
        case 'saturday':
          setSched({
            ...sched,
            saturday: !sched.saturday
          });
          break;
        default:
          break;
      }
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      userType: userType.doctor ? 0 : 1,
      sched
    };
    for (let i = 0; i < e.target.length; i++) {
      const data = e.target[i];
      if (
        data.value !== '' &&
        data.id !== 'schedule' &&
        data.id !== 'userType'
      ) {
        dataToSend[data.id] = data.value;
      }
    }
    getDataToSend(dataToSend);
  };
  return (
    <Form
      onSubmit={onSubmit}
      style={{
        height: '80%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        paddingTop: 40
      }}
    >
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="dob">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control type="date" placeholder="Enter date" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="userType">
        <Form.Label>User Type</Form.Label>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img src={PatientImage} alt="patient" width={26} height={26} />
            <div style={{ width: 14 }} />
            Patient
            <div style={{ width: 51 }} />
            <Form.Check
              onChange={handleChecked}
              name="group1"
              type="radio"
              value="patient"
              checked={userType.patient}
            />
          </div>
          <div style={{ width: 40 }} />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <DoctorLogo />
            <div style={{ width: 14 }} />
            Doctor
            <div style={{ width: 51 }} />
            <Form.Check
              onChange={handleChecked}
              name="group1"
              type="radio"
              value="doctor"
              checked={userType.doctor}
            />
          </div>
        </div>
      </Form.Group>
      {userType.doctor && (
        <>
          <Form.Group className="mb-3" controlId="fee">
            <Form.Label>Doctor Fee</Form.Label>
            <Form.Control type="text" placeholder="Enter Fee" />
          </Form.Group>
        </>
      )}

      <Button
        style={{ width: '100%', backgroundColor: '#3A86FF' }}
        variant="primary"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
}
