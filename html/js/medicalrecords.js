let medicalRecordsTableData;
let medicalRecordsDetailTable;

function deleteMedicalRecordsData(medicalRecordsId) {
    $('#confirmationModal').modal('hide');
    $.post('http://vc-medicrecord/deleteMedicalRecordByID', JSON.stringify({ medicalRecordsId }));
    showLoading();
}

function confirmDeleteMedicalRecordsData(medicalRecordsId) {
    $('#modalBody').html("Are you sure want to delete patient's medical record?");
    $('#confirmationButtonSave').unbind();
    $('#confirmationButtonSave').click(() => deleteMedicalRecordsData(medicalRecordsId));

    $('#confirmationModal').modal();
}

function clearMedicalRecordsPageDetail() {
    $('#medicalRecordsFullname').html('');
    $('#medicalRecordsGender').html('');
    $('#medicalRecordsDOB').html('');
    $('#medicalRecordsPhoneNumber').html('');
    $('#medicalRecordsCID').html('');

    $('#medicalRecordsTableParent').css('display', 'none');
    $('#medicalRecordFormCards').css('display', 'none');
    $('#medicalRecordsContainerDetail').css('display', 'none');

    $('#medicalRecordsDetailContainerTitle').prop('disabled', true);
    $('#medicalRecordsDetailContainerComplaint').prop('disabled', true);
    $('#medicalRecordsDetailContainerDiagnosis').prop('disabled', true);

    $('#editMedicalRecordsDetailContainerForm').css('display', 'block');
    $('#submitMedicalRecordsDetailContainerForm').css('display', 'none');
}

function clearMedicalRecordsPage() {
    $('#searchMedicalRecordsQuery').val('');
    $('#medicalRecordsTableParent').css('display', 'none');
    $('#medicalRecordFormCards').css('display', 'none');

    $('#medicalRecordCID').prop('disabled', false);
    $('#medicalRecordSearchCID').css('display', 'block');
    $('#medicalRecordResetSearchCID').css('display', 'none');
    
    $('#medicalRecordCID').val('');
    $('#medicalRecordFullname').val('');
    $('#medicalRecordGender').val('0');
    $('#medicalRecordPhoneNumber').val('');
    $('#medicalRecordTitle').val('');
    $('#medicalRecordComplaint').val('');
    $('#medicalRecordDiagnosis').val('');
    $('#medicalRecordFormError').css('display', 'none');
    $('#medicalRecordFormCIDError').css('display', 'none');
    $('#medicalRecordsContainerDetail').css('display', 'none');
    $('#medicalRecordsDetailContainerForm').css('display', 'none');
}

function submitEditMedicalRecordsById(data) {
    showLoading();
    $('#confirmationModal').modal('hide');
    $.post('http://vc-medicrecord/submitEditMedicalRecordsById', JSON.stringify(data));
}

function showMedicalRecordsPageDetailForm(medicalRecordsId) {
    const medicalRecordDetail = medicalRecordsDetailTable.find((medicalRecord) => medicalRecord.id === medicalRecordsId);

    $('#medicalRecordsDetailContainerTitle').val(medicalRecordDetail.title);
    $('#medicalRecordsDetailContainerComplaint').val(medicalRecordDetail.complaint);
    $('#medicalRecordsDetailContainerDiagnosis').val(medicalRecordDetail.diagnosis);
    $('#medicalRecordsDetailContainerDoctor').val(medicalRecordDetail.doctorName);

    $('#medicalRecordsDetailContainerFormError').css('display', 'none');
    $('#medicalRecordsDetailTableParent').css('display', 'none');
    $('#medicalRecordsDetailContainerForm').css('display', 'block');

    $('#editMedicalRecordsDetailContainerForm').unbind();
    $('#editMedicalRecordsDetailContainerForm').click(() => {
        $('#medicalRecordsDetailContainerFormError').css('display', 'none');
        $('#editMedicalRecordsDetailContainerForm').css('display', 'none');
        $('#submitMedicalRecordsDetailContainerForm').css('display', 'block');

        $('#medicalRecordsDetailContainerTitle').prop('disabled', false);
        $('#medicalRecordsDetailContainerComplaint').prop('disabled', false);
        $('#medicalRecordsDetailContainerDiagnosis').prop('disabled', false);
    });

    $('#submitMedicalRecordsDetailContainerForm').unbind();
    $('#submitMedicalRecordsDetailContainerForm').click(() => {
        const title = $('#medicalRecordsDetailContainerTitle').val();
        const complaint = $('#medicalRecordsDetailContainerComplaint').val();
        const diagnosis = $('#medicalRecordsDetailContainerDiagnosis').val();

        if (title === "" || title.length > 80 || complaint === "" || complaint.length > 5000 || diagnosis === "" || diagnosis.length > 5000) {
            $('#medicalRecordsDetailContainerFormError').css('display', 'block');
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
        $('#confirmationButtonSave').click(() => submitEditMedicalRecordsById(data));

        $('#confirmationModal').modal();

        $('#medicalRecordsDetailContainerFormError').css('display', 'none');
    });
}

function showMedicalRecordsPageDetailTable(medicalRecords) {
    const table = $('#medicalRecordsDetailTable');
    table.empty();
    medicalRecordsDetailTable = medicalRecords;

    let row = '';
    for(var i=0; i<medicalRecords.length; i++) {
        row += 
        '<tr class="medicalrecord-data" onclick=showMedicalRecordsPageDetailForm(' + medicalRecords[i].id + ')>' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        medicalRecords[i].title +
        '</td>' +
        '<td>' +
        medicalRecords[i].doctorName +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#medicalRecordsContainerDetail').css('display', 'block');
    $('#medicalRecordsDetailTableParent').css('display', 'block');
    $('#medicalRecordsDetailContainerForm').css('display', 'none');
}

function showMedicalRecordsPageDetail(cid) {
    clearMedicalRecordsPageDetail();
    showLoading();
    const patientData = medicalRecordsTableData.find((medicalRecord) => medicalRecord.cid === cid);

    $('#medicalRecordsDetailImage').attr('src', (parseInt(patientData.gender) === 0) ? "https://bootdey.com/img/Content/avatar/avatar7.png" : "https://bootdey.com/img/Content/avatar/avatar3.png");
    $('#medicalRecordsFullname').html(patientData.fullname);
    $('#medicalRecordsGender').html((parseInt(patientData.gender) === 0) ? "Male" : "Female");
    $('#medicalRecordsDOB').html(patientData.dob);
    $('#medicalRecordsPhoneNumber').html(patientData.phonenumber);
    $('#medicalRecordsCID').html(patientData.cid);

    $.post('http://vc-medicrecord/getMedicalRecordsPageDetail', JSON.stringify({ cid }))
}

function showMedicalRecordsResponse(medicalRecords) {
    const table = $('#medicalRecordsTable');
    table.empty();
    medicalRecordsTableData = medicalRecords;

    let row = '';
    for(var i=0; i<medicalRecords.length; i++) {
        row += 
        '<tr>' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        medicalRecords[i].fullname +
        '</td>' +
        '<td>' +
        medicalRecords[i].title +
        '</td>' +
        '<td>' +
        medicalRecords[i].doctorName +
        '</td>' +
        '<td>' +
        '<button onclick="showMedicalRecordsPageDetail(' + medicalRecords[i].cid + ')" class="btn btn-vector-success" style="margin-right: 0.83vw" type="button">VIEW</a>' +
        '<button onclick="confirmDeleteMedicalRecordsData('+ medicalRecords[i].id +')" class="btn btn-vector-warning" type="button">DELETE</a>' +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#medicalRecordsTableParent').css('display', 'block');
}

function fetchMedicalRecordsData() {
    showLoading();
    $.post('http://vc-medicrecord/fetchMedicalRecordsData', JSON.stringify({}))
}

function submitEditHomeDetailRecordsById(data) {
    $('#confirmationModal').modal('hide');
    showLoading();

    $.post('http://vc-medicrecord/submitEditHomeDetailRecordsById', JSON.stringify(data));
}

function submitNewMedicalRecord() {
    const cid = $('#medicalRecordCID').val();
    const title = $('#medicalRecordTitle').val();
    const complaint = $('#medicalRecordComplaint').val();
    const diagnosis = $('#medicalRecordDiagnosis').val();

    const data = {
        cid,
        title,
        complaint,
        diagnosis
    };

    $.post('http://vc-medicrecord/createNewMedicalRecordByCID', JSON.stringify(data))
    $('#confirmationModal').modal('hide');
}

$('#medicalRecordsNav').click(() => {
    clearMedicalRecordsPage();
    fetchMedicalRecordsData();
    showContainer(medicalRecordsContainer);
});

$('#searchMedicalRecordsQuery').keyup((event) => {
    if (event.keyCode === 13) {
        event.preventDefault();

        const query = $('#searchMedicalRecordsQuery').val();
        if (query === '') {
            return;
        }

        $('#searchMedicalRecordsButton').click();
    }
});
$('#searchMedicalRecordsButton').click(() => {
    const query = $('#searchMedicalRecordsQuery').val();
    if (query === '') {
        return;
    }

    clearMedicalRecordsPage();
    showLoading();
    $.post('http://vc-medicrecord/searchMedicalRecords',JSON.stringify({ query: query.toLowerCase() }));
});
$('#createMedicalRecordsButton').click(() => {
    clearMedicalRecordsPage();
    $('#medicalRecordFormCards').css('display', 'block');
});
$('#medicalRecordSearchCID').click(() => {
    const cid = $('#medicalRecordCID').val();
    if (cid === '') {
        return;
    }
    
    const data = {
        cid
    };

    $.post('http://vc-medicrecord/getUserMedicalData', JSON.stringify(data));
});
$('#medicalRecordResetSearchCID').click(() => {
    $('#medicalRecordFullname').val('');
    $('#medicalRecordPhoneNumber').val('');
    $('#medicalRecordResetSearchCID').css('display', 'none');
    $('#medicalRecordSearchCID').css('display', 'block');
    $('#medicalRecordCID').prop('disabled', false);
});
$('#submitMedicalRecord').click(() => {
    if ($('#medicalRecordCID').val() === '' ||
        $('#medicalRecordFullname').val() === '' ||
        $('#medicalRecordPhoneNumber').val() === '' ||
        $('#medicalRecordTitle').val() === '' ||
        $('#medicalRecordTitle').val().length > 80 ||
        $('#medicalRecordComplaint').val() === '' ||
        $('#medicalRecordComplaint').val().length > 5000 ||
        $('#medicalRecordDiagnosis').val() === '' ||
        $('#medicalRecordDiagnosis').val().length > 5000) {
            $('#medicalRecordFormError').css('display', 'block');
            return;
        }

    $('#modalBody').html("Are you sure want to save patient's medical record?");
    $('#confirmationButtonSave').unbind();
    $('#confirmationButtonSave').click(() => submitNewMedicalRecord());

    $('#confirmationModal').modal();
});
$('#confirmationButtonCancel').click(() => {
    $('#confirmationModal').modal('hide');
});

window.medicalRecords = (item) => {
    if (item.type === "medicalRecordsResponse") {
        showMedicalRecordsResponse(item.medicalRecords);
        hideLoading();
    }
    else if (item.type === "getUserMedicalDataResponse") {
        if (item.userData.length === 0) {
            $('#medicalRecordFullname').val('');
            $('#medicalRecordPhoneNumber').val('');
            $('#medicalRecordFormCIDError').css('display', 'block');
            return;
        }
        $('#medicalRecordResetSearchCID').css('display', 'block');
        $('#medicalRecordSearchCID').css('display', 'none');
        $('#medicalRecordCID').prop('disabled', true);

        $('#medicalRecordFullname').val(item.userData[0].fullname);
        $('#medicalRecordGender').val((parseInt(item.userData[0].gender) === 0) ? "0" : "1");
        $('#medicalRecordPhoneNumber').val(item.userData[0].phonenumber);
    }
    else if (item.type === "createNewMedicalRecordByCIDResponse") {
        clearMedicalRecordsPage();
        fetchMedicalRecordsData();
        showContainer(medicalRecordsContainer);
    }
    else if (item.type === "deleteMedicalRecordByIDResponse") {
        clearMedicalRecordsPage();
        fetchMedicalRecordsData();
        showContainer(medicalRecordsContainer);
    }
    else if (item.type === "submitEditHomeDetailRecordsByIdResponse") {
        resetContainer();
        resetHomePage();
        showLoading();
        $.post('http://vc-medicrecord/fetchRecentMedicalRecordsData', JSON.stringify({}));
    }
    else if (item.type === "submitEditPatientMedicalRecordDataResponse") {
        clearSearchPage();
        $('#searchPatientsQuery').val('');
        hideLoading();
        showContainer(searchPatientsContainer);
    }
    else if (item.type === "getMedicalRecordsPageDetailResponse") {
        showMedicalRecordsPageDetailTable(item.medicalRecords)
        hideLoading();
    }
    else if (item.type === "submitEditMedicalRecordsByIdResponse") {
        clearMedicalRecordsPage();
        fetchMedicalRecordsData();
        showContainer(medicalRecordsContainer);
    }
};