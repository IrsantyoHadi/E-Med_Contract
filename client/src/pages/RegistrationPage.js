import React from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import RegistrationForm from '../components/RegistrationForm';

function RegistrationPage({ drizzle, drizzleState }) {
  const emed = drizzle.contracts.Emed;
  const history = useHistory();

  const sendDataToChain = (data) => {
    data.dob = new Date(data.dob).getTime() / 1000;
    const schedule = [];
    Object.entries(data.sched).forEach((dataSchedule, index) => {
      if (dataSchedule[1] === true) {
        switch (dataSchedule[0]) {
          case 'monday':
            schedule.push(0);
            break;
          case 'tuesday':
            schedule.push(1);
            break;
          case 'wednesday':
            schedule.push(2);
            break;
          case 'thursday':
            schedule.push(3);
            break;
          case 'friday':
            schedule.push(4);
            break;
          case 'saturday':
            schedule.push(5);
            break;
          default:
            break;
        }
      }
    });
    const dataFee = data.fee ? +data.fee : 0;
    emed.methods
      .registerUser(data.name, data.dob, data.userType, dataFee, schedule)
      .send({
        from: drizzleState.accounts[0],
      })
      .then((data) => {
        history.push('/');
      });
  };

  return (
    <>
      <Header />
      <Container>
        <h1>Registration Page</h1>
        <RegistrationForm getDataToSend={sendDataToChain} />
      </Container>
    </>
  );
}

export default RegistrationPage;
