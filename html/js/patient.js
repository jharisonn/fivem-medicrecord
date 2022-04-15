let patientsSearchData;
let patientDetailMedicalRecordByIdList;

function clearSearchPage() {
    $('#patientFormCards').css('display', 'none');
    $('#patientProfileCards').css('display', 'none');
    $('#searchNotFound').css('display', 'none');
    $('#successData').css('display', 'none');
    $('#patientDetailProfile').css('display', 'none');
}

function clearFormData() {
    $('#fullname').val('');
    $('#gender').val('0');
    $('#dateofbirth').val('');
    document.getElementById('dateofbirth').max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    $('#phonenumber').val('');
    $('#cid').val('');
    $('#title').val('');
    $('#complaint').val('');
    $('#diagnosis').val('');
    $('#submitFormError').css('display', 'none');
}

function clearPatientDetailForm() {
    $('#patientDetailMedicalRecordTitle').val('');
    $('#patientDetailMedicalRecordComplaint').val('');
    $('#patientDetailMedicalRecordDiagnosis').val('');
    $('#patientDetailMedicalRecordDoctor').val('');
    $('#patientDetailMedicalRecordTitle').prop('disabled', true);
    $('#patientDetailMedicalRecordComplaint').prop('disabled', true);
    $('#patientDetailMedicalRecordDiagnosis').prop('disabled', true);
    $('#editPatientDetailMedicalRecordForm').css('display', 'block');
    $('#submitPatientDetailMedicalRecordForm').css('display', 'none');
    $('#patientDetailRecordFormError').css('display', 'none');
}

const submitMedicalRecord = (id) => () => {
    const title = $('#title').val().replace(/</g, "&lt;");
    const complaint = $('#complaint').val().replace(/</g, "&lt;");
    const diagnosis = $('#diagnosis').val().replace(/</g, "&lt;");

    const data = {
        cid: id,
        title,
        complaint,
        diagnosis
    };

    $('#confirmationModal').modal('hide');
    $('#patientFormCards').css('display', 'none');
    showLoading();
    $.post('http://vc-medicrecord/submitMedicalRecordData', JSON.stringify(data));
}

function createMedicalRecordCardsHandler(id) {
    clearSearchPage();
    clearFormData();

    const patientEditCards = $('#patientFormCards');
    const patientData = patientsSearchData.find((data) => data.id === id);

    $('#fullname').val(patientData.fullname);
    $('#gender').val((parseInt(patientData.gender) === 0) ? "0" : "1");
    $('#dateofbirth').val(patientData.dob);
    $('#phonenumber').val(patientData.phonenumber);
    $('#cid').val(patientData.id);

    $('#submitFormCards').unbind();
    $('#submitFormCards').click(() => {
        const title = $('#title').val().replace(/</g, "&lt;");
        const complaint = $('#complaint').val().replace(/</g, "&lt;");
        const diagnosis = $('#diagnosis').val().replace(/</g, "&lt;");

        if (title === "" || 
            complaint === "" ||
            diagnosis === "" ||
            title.length > 80 ||
            complaint.length > 5000 ||
            diagnosis.length > 5000) {
            $('#submitFormError').css('display', 'block');
            return;
        }

        $('#modalBody').html("Are you sure want to save patient's medical record?");
        $('#confirmationButtonSave').unbind();
        $('#confirmationButtonSave').click(submitMedicalRecord(id));
        $('#confirmationModal').modal();
    });
    patientEditCards.css('display', 'block');
}

function viewMedicalRecordCardsHandler(id) {
    clearSearchPage();
    clearFormData();

    const patientData = patientsSearchData.find((data) => data.id === id);

    $('#detailImage').attr('src', (parseInt(patientData.gender) === 0) ? "https://bootdey.com/img/Content/avatar/avatar7.png" : "https://bootdey.com/img/Content/avatar/avatar3.png");
    $('#detailFullname').text(patientData.fullname.replace(/</g, "&lt;"));
    $('#detailGender').text((parseInt(patientData.gender) === 0) ? 'Male' : 'Female');
    $('#detailDOB').text(patientData.dob.replace(/</g, "&lt;"));
    $('#detailPhoneNumber').text(patientData.phonenumber.replace(/</g, "&lt;"));
    $('#detailCID').text(patientData.id);

    $.post('http://vc-medicrecord/getDetailMedicalRecordsData', JSON.stringify({ id }))
    showLoading();
}

function getCardBody(title, valueContent) {
    return '<div class="row">' +
    '<div class="col-sm-3">' +
      '<h6 class="mb-0" style="color: #e4e4e4 !important">'+ title + '</h6>' +
    '</div>' +
    '<div class="col-sm-9">' +
      valueContent +
    '</div></div><hr>';
}

function getCardButton(index) {
    return '<div class="row float-right">' +
    '<div class="col-sm-12 ml-auto">' +
    '<button onclick="viewMedicalRecordCardsHandler('+ index +')" class="btn btn-vector-warning" type="button" style="margin-right: 10px;">View Medical Record</a>' +
    '<button onclick="createMedicalRecordCardsHandler('+ index +')" class="btn btn-vector-success" type="button">Create Medical Record</a>' +
    '</div></div>'
}

function showPatientsData(patients) {
    if (!patients || patients.length === 0) {
        $('#searchNotFound').css('display', 'block');

        return;
    }
    patientsSearchData = patients;
    let cards = '';
    const patientProfileCards = $('#patientProfileCards');
    patientProfileCards.empty();  

    for(var i=0; i<patients.length; i++) {
        let card = '<div class="card mis-card" style="background-color: #212732 !important; border-color: #e4e4e4;"><div class="card-body" style="background-color: #212732 !important">';
        card += getCardBody('Fullname', patients[i].fullname);
        card += getCardBody('Gender', (parseInt(patients[i].gender) === 0) ? 'Male' : 'Female');
        card += getCardBody('DOB', patients[i].dob);
        card += getCardBody('Phone Number', patients[i].phonenumber);
        card += getCardBody('CID', patients[i].id);
        card += getCardButton(patients[i].id);
        card += '</div></div>'
        cards += card;
    }

    patientProfileCards.append(cards);
    patientProfileCards.css('display', 'block');
    patientProfileCards.scrollTop(0);
}

function submitEditPatientMedicalRecordData(data) {
    showLoading();
    $('#confirmationModal').modal('hide');
    $.post('http://vc-medicrecord/submitEditPatientMedicalRecordData', JSON.stringify(data));
}

function showMedicalRecordsDataById(medicalRecordsId) {
    const patientDetail = patientDetailMedicalRecordByIdList.find((medicalRecord) => medicalRecord.medicalRecordsId === medicalRecordsId);
    clearPatientDetailForm();

    $('#patientDetailMedicalRecordTitle').val(patientDetail.title.replace(/</g, "&lt;"));
    $('#patientDetailMedicalRecordComplaint').val(patientDetail.complaint.replace(/</g, "&lt;"));
    $('#patientDetailMedicalRecordDiagnosis').val(patientDetail.diagnosis.replace(/</g, "&lt;"));
    $('#patientDetailMedicalRecordDoctor').val(patientDetail.doctorName.replace(/</g, "&lt;"));
    $('#editPatientDetailMedicalRecordForm').unbind();
    $('#editPatientDetailMedicalRecordForm').click(() => {
        $('#patientDetailMedicalRecordTitle').prop('disabled', false);
        $('#patientDetailMedicalRecordComplaint').prop('disabled', false);
        $('#patientDetailMedicalRecordDiagnosis').prop('disabled', false);

        $('#submitPatientDetailMedicalRecordForm').unbind();
        $('#submitPatientDetailMedicalRecordForm').click(() => {
            const title = $('#patientDetailMedicalRecordTitle').val().replace(/</g, "&lt;");
            const complaint = $('#patientDetailMedicalRecordComplaint').val().replace(/</g, "&lt;");
            const diagnosis = $('#patientDetailMedicalRecordDiagnosis').val().replace(/</g, "&lt;");

            if (title === '' || title.length > 80 || complaint === '' || complaint.length > 5000 || diagnosis === '' || diagnosis.length > 5000) {
                $('#patientDetailRecordFormError').css('display', 'block');
                return;
            }

            const data = {
                medicalRecordsId,
                title,
                complaint,
                diagnosis
            }

            $('#modalBody').html("Are you sure want to edit medical record?");

            $('#confirmationButtonSave').unbind();
            $('#confirmationButtonSave').click(() => submitEditPatientMedicalRecordData(data));

            $('#confirmationModal').modal();
        });
        
        $('#editPatientDetailMedicalRecordForm').css('display', 'none');
        $('#submitPatientDetailMedicalRecordForm').css('display', 'block');
    });
    
    $('#patientDataProfileTable').css('display', 'none');
    $('#patientDetailMedicalRecordForm').css('display', 'block');
}

function showMedicalRecordsData(medicalRecords) {
    patientDetailMedicalRecordByIdList = medicalRecords;
    const table = $('#detailTable');
    table.empty();
    
    let row = '';
    for(var i=0; i<medicalRecords.length; i++) {
        row += 
        '<tr class="medicalrecord-data" onclick="showMedicalRecordsDataById('+ medicalRecords[i].medicalRecordsId +')">' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        medicalRecords[i].title.replace(/</g, "&lt;") +
        '</td>' +
        '<td>' +
        medicalRecords[i].doctorName.replace(/</g, "&lt;") +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#patientDataProfileTable').css('display', 'block');
    $('#patientDetailProfile').css('display', 'block');
    $('#patientDetailMedicalRecordForm').css('display', 'none');
}

$('#searchPatientsButton').click(() => {
    const query = $('#searchPatientsQuery').val();
    if (query === '') {
        return;
    }

    clearSearchPage();
    showLoading();
    $.post('http://vc-medicrecord/searchPatients',JSON.stringify({ query: query.toLowerCase() }));
});

$('#searchPatientsQuery').keyup((event) => {
    if (event.keyCode === 13) {
        event.preventDefault();

        const query = $('#searchPatientsQuery').val();
        if (query === '') {
            return;
        }

        $('#searchPatientsButton').click();
    }
});

$('#searchPatientNav').click(() => {
    clearSearchPage();
    $('#searchPatientsQuery').val('');
    showContainer(searchPatientsContainer);
});

window.patient = (item) => {
    if (item.type === "patientsDataResponse") {
        showPatientsData(item.patients)
        hideLoading();
    }

    else if (item.type === "detailMedicalRecordsResponse") {
        showMedicalRecordsData(item.medicalRecords);
        hideLoading();
    }

    else if (item.type === "postMedicalRecordResponse") {
        if (item.response) {
            $('#successData').css('display', 'block');
        }
        hideLoading();
    }
};