import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
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
          <ListDoctor drizzle={drizzle} drizzleState={drizzleState} />
        )}
        {user && user.userType === '0' && (
          <ListPatient drizzle={drizzle} drizzleState={drizzleState} />
        )}
      </Container>
    </>
  );
}

export default StartingPage;
