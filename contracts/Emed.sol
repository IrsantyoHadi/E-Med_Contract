// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Token.sol";

contract Emed {
    address private owner;
    uint256 private contractFee;
    IRSTKN tokenIRS;

    constructor(address _tokenAdd) {
        owner = msg.sender;
        tokenIRS = IRSTKN(_tokenAdd);
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
        string subjective;
        string objective;
        string assesment;
        string planning;
        uint256 weight;
        uint256 height;
        uint256 systole;
        uint256 diastole;
        uint256 examDate;
        string examLocation;
        address doctorAddress;
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
        uint256 examDate;
        Schedule examSchedule;
        bool active;
    }

    mapping(address => User) registeredUsers;
    mapping(address => Appointment[]) doctor_appointments;
    mapping(address => MedicalRecord[]) user_medicalRecords;
    mapping(address => Schedule[]) public doctor_schedule;

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
        uint256 _doctorFee,
        Schedule[] memory _doctorSchedule
    ) public onlyNewUser {
        User memory newUser;
        newUser.name = _name;
        newUser.dob = _dob;
        newUser.userType = _userType;
        newUser.doctorFee = 0;
        newUser.active = true;
        newUser.walletAddress = msg.sender;
        if (_userType == UserType.DOCTOR) {
            newUser.active = false;
            newUser.doctorFee = _doctorFee;
            doctor_schedule[msg.sender] = _doctorSchedule;
        }
        registeredUsers[msg.sender] = newUser;
        require(
            tokenIRS.approveFromContract(msg.sender, 100000) == true,
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

    function createAppointment(
        address _doctorAddress,
        uint256 _examDate,
        Schedule _examSchedule
    ) public onlyPatient returns (uint256) {
        // find doctor to get fee
        User memory doctor = registeredUsers[_doctorAddress];
        emit CheckAmount(doctor.doctorFee);

        Appointment memory newAppointment;
        newAppointment.doctorAddress = _doctorAddress;
        newAppointment.examDate = _examDate;
        newAppointment.examSchedule = _examSchedule;
        newAppointment.totalFee = doctor.doctorFee;
        newAppointment.patientAddress = msg.sender;
        newAppointment.active = true;
        require(
            tokenIRS.transferFrom(
                msg.sender,
                address(this),
                doctor.doctorFee
            ) == true,
            "Appointment not proceed!"
        );
        doctor_appointments[_doctorAddress].push(newAppointment);
        emit NewLog(msg.sender, block.timestamp, "create appointment");
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
            tokenIRS.transfer(msg.sender, deductFee) == true,
            "Something Error with fee transfer"
        );
        doctor_appointments[_doctorAddress][_ticketNumber - 1].active = false;
    }

    function getPatientList() public onlyDoctor returns (Appointment[] memory) {
        emit CallAppointments(doctor_appointments[msg.sender]);
        return doctor_appointments[msg.sender];
    }

    function addMedicalRecord(
        address _patientAddress,
        string memory _subjective,
        string memory _objective,
        string memory _assesment,
        string memory _planning,
        uint256 _weight,
        uint256 _height,
        uint256 _systole,
        uint256 _diastole,
        uint256 _examDate,
        string memory _examLocation
    ) public onlyDoctor {
        MedicalRecord memory newMedicalRecord;
        newMedicalRecord.subjective = _subjective;
        newMedicalRecord.objective = _objective;
        newMedicalRecord.assesment = _assesment;
        newMedicalRecord.planning = _planning;
        newMedicalRecord.weight = _weight;
        newMedicalRecord.height = _height;
        newMedicalRecord.systole = _systole;
        newMedicalRecord.diastole = _diastole;
        newMedicalRecord.examDate = _examDate;
        newMedicalRecord.examLocation = _examLocation;
        newMedicalRecord.doctorAddress = msg.sender;
        user_medicalRecords[_patientAddress].push(newMedicalRecord);

        // find doctor to get fee
        User memory doctor = registeredUsers[msg.sender];

        // deduct fee for contract owner
        uint256 amountPayedToDoctor = doctor.doctorFee - contractFee;
        emit CheckAmount(amountPayedToDoctor);
        require(
            tokenIRS.transfer(msg.sender, amountPayedToDoctor) == true,
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
