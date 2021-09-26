import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
export default function RegistrationForm({ getDataToSend }) {
  const [userType, setUserType] = useState({
    doctor: false,
    patient: true,
  });
  const [sched, setSched] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const handleChecked = (e) => {
    const target = e.target;
    const id = target.id;
    if (id === 'userType') {
      if (target.value === 'doctor') {
        setUserType({
          doctor: true,
          patient: false,
        });
      } else {
        setUserType({
          patient: true,
          doctor: false,
        });
        setSched({
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        });
      }
    }
    if (id === 'schedule') {
      switch (target.value) {
        case 'monday':
          setSched({
            ...sched,
            monday: !sched.monday,
          });
          break;
        case 'tuesday':
          setSched({
            ...sched,
            tuesday: !sched.tuesday,
          });
          break;
        case 'wednesday':
          setSched({
            ...sched,
            wednesday: !sched.wednesday,
          });
          break;
        case 'thursday':
          setSched({
            ...sched,
            thursday: !sched.thursday,
          });
          break;
        case 'friday':
          setSched({
            ...sched,
            friday: !sched.friday,
          });
          break;
        case 'saturday':
          setSched({
            ...sched,
            saturday: !sched.saturday,
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
      sched,
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
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="dob">
        <Form.Label>Dob</Form.Label>
        <Form.Control type="date" placeholder="Enter date" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="userType">
        <Form.Label>User Type</Form.Label>
        <Form.Check
          onChange={handleChecked}
          name="group1"
          type="radio"
          label="Patient"
          value="patient"
          checked={userType.patient}
        />
        <Form.Check
          onChange={handleChecked}
          name="group1"
          type="radio"
          label="Doctor"
          value="doctor"
          checked={userType.doctor}
        />
      </Form.Group>
      {userType.doctor && (
        <>
          <Form.Group className="mb-3" controlId="fee">
            <Form.Label>Doctor Fee</Form.Label>
            <Form.Control type="text" placeholder="Enter Fee" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="schedule">
            <Form.Label>Avalaible Schedule</Form.Label>
            <Form.Check
              type="checkbox"
              label="Monday"
              value="monday"
              checked={sched.monday}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              label="Tuesday"
              value="tuesday"
              checked={sched.tuesday}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              label="Wednesday"
              value="wednesday"
              checked={sched.wednesday}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              label="Thursday"
              value="thursday"
              checked={sched.thrusday}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              label="Friday"
              value="friday"
              checked={sched.friday}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              label="Saturday"
              value="saturday"
              checked={sched.saturday}
              onChange={handleChecked}
            />
          </Form.Group>
        </>
      )}

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
