import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import Header from '../components/Header';
import RegistrationForm from '../components/RegistrationForm';
import SideBar from '../components/Sidebar';
import Welcome from '../components/Welcome';

function RegistrationPage({ drizzle, drizzleState }) {
  const emed = drizzle.contracts.Emed;
  const history = useHistory();
  const [data, setData] = useState([]);

  const sendDataToChain = (data) => {
    data.dob = new Date(data.dob).getTime() / 1000;
    const dataFee = data.fee ? +data.fee : 0;
    emed.methods
      .registerUser(data.name, data.dob, data.userType, dataFee)
      .send({
        from: drizzleState.accounts[0]
      })
      .then((data) => {
        history.push('/');
      });
  };
  return (
    <>
      <SideBar />
      <div className="main-wrapper">
        <div className="main-content">
          <div className="registration-box">
            <div className="title-box">
              <p className="title">Registration</p>
            </div>
            <RegistrationForm getDataToSend={sendDataToChain} />
          </div>
          <div className="registration-box">
            <Welcome />
          </div>
        </div>
      </div>
    </>
  );
}

export default RegistrationPage;
