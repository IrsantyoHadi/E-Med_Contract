// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Token.sol";

contract Emed {
    address private owner;
    uint256 private contractFee;
    XLCTKN tokenXLC;

    constructor(address _tokenAdd) {
        owner = msg.sender;
        tokenXLC = XLCTKN(_tokenAdd);
        contractFee = 10;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner Can Access");
        _;
    }

    modifier onlyDoctor() {
        User memory foundUser = registeredUsers[msg.sender];
        require(
            (foundUser.userType == UserType.DOCTOR && foundUser.active == true),
            "Only Active Doctor Can Access"
        );
        _;
    }

    modifier onlyPatient() {
        User memory foundUser = registeredUsers[msg.sender];
        require(
            foundUser.userType == UserType.PATIENT,
            "Only Patient Can Access"
        );
        _;
    }

    modifier onlyNewUser() {
        User memory foundUser = registeredUsers[msg.sender];
        require(foundUser.dob == 0, "Only New User Can Access");
        _;
    }

    event NewLog(address creator, uint256 date, string functionName);
    event NewMedicalRecord(address patient, address doctor, uint256 date);
    event CallMedicalRecords(MedicalRecord[] _m);
    event CallAppointments(Appointment[] _a);
    event CheckAmount(uint256 amount);

    struct MedicalRecord {
        string doctorName;
        string subjective;
        string assesment;
        string planning;
        string doctor_notes;
        address doctorAddress;
        uint256 examDate;
    }

    enum UserType {
        DOCTOR,
        PATIENT
    }

    enum Schedule {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY
    }

    struct User {
        string name;
        uint256 dob;
        UserType userType;
        uint256 doctorFee;
        address walletAddress;
        bool active;
    }

    struct Appointment {
        address doctorAddress;
        address patientAddress;
        uint256 totalFee;
        bool active;
    }

    mapping(address => User) public registeredUsers;
    mapping(address => Appointment[]) doctor_appointments;
    mapping(address => MedicalRecord[]) user_medicalRecords;
    mapping(address => Schedule[]) public doctor_schedule;
    mapping(address => bool) patientExamStatus;

    User[] public validDoctors;

    // to check when user is already registered
    function checkUser()
        public
        view
        returns (
            string memory name,
            UserType userType,
            uint256 doctorFee,
            address walletAddress,
            bool active
        )
    {
        User memory u = registeredUsers[msg.sender];
        return (u.name, u.userType, u.doctorFee, u.walletAddress, u.active);
    }

    // for register new User
    function registerUser(
        string memory _name,
        uint256 _dob,
        UserType _userType,
        uint256 _doctorFee
    ) public onlyNewUser {
        User memory newUser;
        newUser.name = _name;
        newUser.dob = _dob;
        newUser.userType = _userType;
        newUser.doctorFee = 0;
        newUser.active = true;
        newUser.walletAddress = msg.sender;
        if (_userType == UserType.DOCTOR) {
            require(_doctorFee > contractFee, "Insert Higher Doctor Fee");
            newUser.active = true;
            newUser.doctorFee = _doctorFee;
            validDoctors.push(newUser);
        }
        registeredUsers[msg.sender] = newUser;
        require(
            tokenXLC.approveFromContract(msg.sender, 100000) == true,
            "approve contract failed"
        );
        emit NewLog(msg.sender, block.timestamp, "register user");
    }

    function validateDoctor(address _doctorAddress) public onlyOwner {
        User memory foundDoctor = registeredUsers[_doctorAddress];
        foundDoctor.active = true;
        registeredUsers[_doctorAddress] = foundDoctor;
        validDoctors.push(foundDoctor);
        emit NewLog(msg.sender, block.timestamp, "validate doctor");
    }

    function createAppointment(address _doctorAddress)
        public
        onlyPatient
        returns (uint256)
    {
        // find doctor to get fee
        User memory doctor = registeredUsers[_doctorAddress];
        emit CheckAmount(doctor.doctorFee);

        Appointment memory newAppointment;
        newAppointment.doctorAddress = _doctorAddress;
        newAppointment.totalFee = doctor.doctorFee;
        newAppointment.patientAddress = msg.sender;
        newAppointment.active = true;
        require(
            tokenXLC.transferFrom(
                msg.sender,
                address(this),
                doctor.doctorFee
            ) == true,
            "Appointment not proceed!"
        );
        doctor_appointments[_doctorAddress].push(newAppointment);
        emit NewLog(msg.sender, block.timestamp, "create appointment");
        patientExamStatus[msg.sender] = true;
        return doctor_appointments[_doctorAddress].length;
    }

    function cancelAppointment(address _doctorAddress, uint256 _ticketNumber)
        public
        onlyPatient
    {
        require(
            _ticketNumber - 1 < doctor_appointments[_doctorAddress].length,
            "Wrong ticket number"
        );
        require(
            doctor_appointments[_doctorAddress][_ticketNumber - 1]
                .patientAddress == msg.sender,
            "Thats Ticket is not yours"
        );
        // find doctor to get fee
        User memory doctor = registeredUsers[_doctorAddress];
        emit CheckAmount(doctor.doctorFee);
        uint256 deductFee = doctor.doctorFee - contractFee;
        require(
            tokenXLC.transfer(msg.sender, deductFee) == true,
            "Something Error with fee transfer"
        );
        require(
            doctor_appointments[_doctorAddress][_ticketNumber - 1].active ==
                true,
            "Ticket already cancel"
        );
        patientExamStatus[msg.sender] = false;
        doctor_appointments[_doctorAddress][_ticketNumber - 1].active = false;
    }

    function getPatientList() public onlyDoctor returns (Appointment[] memory) {
        emit CallAppointments(doctor_appointments[msg.sender]);
        return doctor_appointments[msg.sender];
    }

    function getPatientDetail(address _patientAddress)
        public
        view
        onlyDoctor
        returns (User memory)
    {
        return registeredUsers[_patientAddress];
    }

    function addMedicalRecord(
        address _patientAddress,
        string memory _subjective,
        string memory _assesment,
        string memory _planning,
        string memory _doctorNotes,
        uint256 _examDate
    ) public onlyDoctor {
        //this one is for chec if Patient is In Examination Prosess to prevent doctor do multiple adding
        require(
            patientExamStatus[_patientAddress] == true,
            "Patient not in Exam Proses"
        );
        // after the condition pass status became false due the end of Examination proses
        patientExamStatus[_patientAddress] = false;

        // find doctor to get fee
        User memory doctor = registeredUsers[msg.sender];

        MedicalRecord memory newMedicalRecord;
        newMedicalRecord.subjective = _subjective;
        newMedicalRecord.assesment = _assesment;
        newMedicalRecord.planning = _planning;
        newMedicalRecord.doctor_notes = _doctorNotes;
        newMedicalRecord.examDate = _examDate;
        newMedicalRecord.doctorAddress = msg.sender;
        newMedicalRecord.doctorName = doctor.name;
        user_medicalRecords[_patientAddress].push(newMedicalRecord);

        // deduct fee for contract owner
        uint256 amountPayedToDoctor = doctor.doctorFee - contractFee;
        require(
            tokenXLC.transfer(msg.sender, amountPayedToDoctor) == true,
            "Payment not proceed!"
        );
        emit NewMedicalRecord(_patientAddress, msg.sender, block.timestamp);
    }

    function doctorGetMedicalRecords(address _patientAddress)
        public
        onlyDoctor
        returns (MedicalRecord[] memory)
    {
        emit CallMedicalRecords(user_medicalRecords[_patientAddress]);
        return user_medicalRecords[_patientAddress];
    }

    function userGetOwnMedicalRecords()
        public
        onlyPatient
        returns (MedicalRecord[] memory)
    {
        emit CallMedicalRecords(user_medicalRecords[msg.sender]);
        return user_medicalRecords[msg.sender];
    }

    function setContractFee(uint256 _fee) public onlyOwner {
        contractFee = _fee;
    }
}
