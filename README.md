# E-Medical Record in ethereum smart contract

Electronic Medical Record using block chain for Emurgo Class final task

## Installation

To Run this project you need truffle in your local machine, and ganache for test chain, after do the installation simply migrate the contract to ganache, make sure your ganache run on port 7545 your you can manually setup in truffle-config.js

```bash
npm run migrate
```

For run the react client you can run 
```bash
npm run start
```

## Application Flow

Basically the flow is patient registration to the doctor and then the doctor do the examination and save the electronic medical record in Ethereum Blockchain.

For more detail about the application flow you can check in [here](https://drive.google.com/file/d/1ykOWsT9VM0EV3BBSjeBYvS824x-GFGq3/view?usp=sharing)

## Function Detail

| Function                 | Input                                                                                                                                                                                                                                     | Description                                                                                                                                                                                                                                                |
| ------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| checkUser                |                                                                                                                                                                                                                                           | for checking in the first time user enter the application it will return `user information`                                                                                                                                                                |
| registerUser             | \_name (string), \_dob(unix date), \_userType (userType), \_doctorFee(uint), \_doctorSchedule(Array<Schedule>)                                                                                                                            | for register new User, it need input `_userType` **doctor = 0 patient = 1**                                                                                                                                                                                |
| validateDoctor           | \_doctorAddress (address)                                                                                                                                                                                                                 | to validate if the doctor is real, can access only by **contract owner**                                                                                                                                                                                   |
| validateDoctor           | \_doctorAddress (address)                                                                                                                                                                                                                 | to validate if the doctor is real, can access only by **contract owner**                                                                                                                                                                                   |
| createAppointment        | \_doctorAddress(address), \_examDate(unix date) , \_examSchedule(Schedule)                                                                                                                                                                | to create new appointment with the doctor can access obly by **user with type patient** , as for `_examSchedule` its enum type between 0 - 6 represent monday - saturday, it will return **ticket number** , this function deduct IRS token for doctor fee |
| cancelAppointment        | \_doctorAddress(address), \_ticketNumber(uint)                                                                                                                                                                                            | to cancel appointment by doctor address and ticket number                                                                                                                                                                                                  |
| getPatientList           |                                                                                                                                                                                                                                           | for doctor to get all the appointment base on his address                                                                                                                                                                                                  |
| addMedicalRecord         | \_patientAddress(address), \_subjective(string), \_objective(string), \_assesment(string), \_planning(string), \_weight(uint256), \_height(uint256), \_systole(uint256), diastole(uint256), \_examDate(unix date), \_examLocation(string) | to generate new medical record for user patient, this function also transfer IRS token to doctor address                                                                                                                                                   |
| doctorGetMedicalRecords  | \_patientAddress(address)                                                                                                                                                                                                                 | for doctor to get all the medical record base on patient address                                                                                                                                                                                           |
| userGetOwnMedicalRecords |                                                                                                                                                                                                                                           | for patient to get all his medical record                                                                                                                                                                                                                  |
| setContractFee           | \_fee(uint)                                                                                                                                                                                                                               | for owner setting the fee deduct from doctor_fee for administration                                                                                                                                                                                        |
