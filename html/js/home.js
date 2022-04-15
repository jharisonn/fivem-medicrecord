let userJob;
let homeDetailMedicalRecordByIdList;
let recentMedicalRecordsData;

function resetHomePage() {
    $('#homeTableParent').css('display', 'none');
    $('#homeDetailMedicalRecord').css('display', 'none');

    $('#homeDetailImage').attr('src', "https://bootdey.com/img/Content/avatar/avatar7.png");
    $('#homeDetailFullname').text('');
    $('#homeDetailGender').text('');
    $("#homeDetailDOB").text('');
    $('#homeDetailPhoneNumber').text('');
    $('#homeDetailCID').text('');
}

function clearHomeDetailMedicalRecordsByIdForm() {
    $('#homeDetailMedicalRecordTitle').val('');
    $('#homeDetailMedicalRecordComplaint').val('');
    $('#homeDetailMedicalRecordDiagnosis').val('');
    $('#homeDetailMedicalRecordDoctor').val('');
    $('#homeDetailMedicalRecordTitle').prop('disabled', true);
    $('#homeDetailMedicalRecordComplaint').prop('disabled', true);
    $('#homeDetailMedicalRecordDiagnosis').prop('disabled', true);
    $('#editHomeDetailMedicalRecordForm').css('display', 'block');
    $('#submitHomeDetailMedicalRecordForm').css('display', 'none');
    $('#homeDetailRecordFormError').css('display', 'none');
}

function showDetailMedicalRecordsByIdForm(medicalRecordsId) {
    const detailMedicalRecordsById = homeDetailMedicalRecordByIdList.find((medicalRecord) => medicalRecord.medicalRecordsId === medicalRecordsId);
    clearHomeDetailMedicalRecordsByIdForm();
    $('#homeDetailTableParent').css('display', 'none');

    $('#homeDetailMedicalRecordTitle').val(detailMedicalRecordsById.title);
    $('#homeDetailMedicalRecordComplaint').val(detailMedicalRecordsById.complaint);
    $('#homeDetailMedicalRecordDiagnosis').val(detailMedicalRecordsById.diagnosis);
    $('#homeDetailMedicalRecordDoctor').val(detailMedicalRecordsById.doctorName);
    $('#editHomeDetailMedicalRecordForm').unbind();
    $('#editHomeDetailMedicalRecordForm').click(() => {
        $('#homeDetailMedicalRecordTitle').prop('disabled', false);
        $('#homeDetailMedicalRecordComplaint').prop('disabled', false);
        $('#homeDetailMedicalRecordDiagnosis').prop('disabled', false);

        $('#submitHomeDetailMedicalRecordForm').unbind();
        $('#submitHomeDetailMedicalRecordForm').click(() => {
            const title = $('#homeDetailMedicalRecordTitle').val();
            const complaint = $('#homeDetailMedicalRecordComplaint').val();
            const diagnosis = $('#homeDetailMedicalRecordDiagnosis').val();

            if (title === '' || title.length > 80 || complaint === '' || complaint.length > 5000 || diagnosis === '' || diagnosis.length > 5000) {
                $('#homeDetailRecordFormError').css('display', 'block');
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
            $('#confirmationButtonSave').click(() => submitEditHomeDetailRecordsById(data));

            $('#confirmationModal').modal();
        });
        
        $('#editHomeDetailMedicalRecordForm').css('display', 'none');
        $('#submitHomeDetailMedicalRecordForm').css('display', 'block');
    });

    $('#homeDetailMedicalRecordForm').css('display', 'block');
}

function showDetailMedicalRecordsById(detailMedicalRecord) {
    homeDetailMedicalRecordByIdList = detailMedicalRecord;
    const homeDetailMedicalRecord = $('#homeDetailMedicalRecord');
    const table = $('#homeDetailTable');
    table.empty();

    let row = '';
    for(var i=0; i<detailMedicalRecord.length; i++) {
        row += 
        '<tr class="medicalrecord-data" onclick="showDetailMedicalRecordsByIdForm('+ detailMedicalRecord[i].medicalRecordsId +')">' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        detailMedicalRecord[i].title +
        '</td>' +
        '<td>' +
        detailMedicalRecord[i].doctorName +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#homeDetailMedicalRecordForm').css('display', 'none');
    homeDetailMedicalRecord.css('display', 'block');
    $('#homeDetailTableParent').css('display', 'block');
}

function onMedicalRecordDataClick(cid) {
    resetHomePage();
    const patientData = recentMedicalRecordsData.find((medicalRecords) => medicalRecords.cid === cid);
    $('#homeDetailImage').attr('src', (parseInt(patientData.gender) === 0) ? "https://bootdey.com/img/Content/avatar/avatar7.png" : "https://bootdey.com/img/Content/avatar/avatar3.png");
    $('#homeDetailFullname').text(patientData.fullname);
    $('#homeDetailGender').html((parseInt(patientData.gender) === 0) ? "Male" : "Female");
    $("#homeDetailDOB").html(patientData.dob);
    $('#homeDetailPhoneNumber').html(patientData.phonenumber);
    $('#homeDetailCID').html(patientData.cid);
    showLoading();
    $.post('http://vc-medicrecord/getDetailMedicalRecordsById', JSON.stringify({ cid }))
}

function showMedicalRecordsTable(medicalRecords) {
    const table = $('#homeTable');
    table.empty();
    
    recentMedicalRecordsData = medicalRecords;
    let row = '';
    for(var i=0; i<medicalRecords.length; i++) {
        row += 
        '<tr class="medicalrecord-data" onclick="onMedicalRecordDataClick(' + medicalRecords[i].cid + ')">' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        medicalRecords[i].fullname +
        '</td>' +
        '<td>' +
        medicalRecords[i].phonenumber +
        '</td>' +
        '<td>' +
        medicalRecords[i].title +
        '</td>' +
        '<td>' +
        medicalRecords[i].doctorName +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#homeTableParent').css('display', 'block');
}

function fetchDataSchedules() {
    if (userJob === 'non-doctor') {
        $('#scheduleHeader').css('display', 'none');
        showLoading();
        $.post('http://vc-medicrecord/getNormalScheduleData', JSON.stringify({}))
        return;
    }

    const table = $('#scheduleParentTable');
    table.css('display', 'block');
    showLoading();
    $.post('http://vc-medicrecord/getSchedulesData', JSON.stringify({}));
}

function clearSchedulePage() {
    $('#createSchedule').css('display', 'block');
    $('#scheduleParentTable').css('display', 'none');
    $('#scheduleFormCards').css('display', 'none');
    $('#scheduleNonDoctorFormCards').css('display', 'none');

    $('#scheduleHeader').css('display', 'flex');
    $('#queueSection').css('display', 'none');
    $('#queueNumber').text('');
    $('#successSubmitNonDoctorSection').css('display', 'none');
}

function clearScheduleForm() {
    const now = toIsoString(new Date());
    $('#scheduleCID').val('');
    $('#scheduleFullname').val('');
    $('#scheduleGender').val('0');
    $('#schedulePhoneNumber').val('');
    $('#scheduleDateTime').val(now);
    document.getElementById('scheduleDateTime').min = now;
    $('#scheduleComplaint').val('');

    $('#scheduleCID').prop('disabled', false);
    $('#scheduleSearchCID').css('display', 'block');
    $('#scheduleResetSearchCID').css('display', 'none');
    $('#scheduleFormError').css('display', 'none');
    $('#scheduleFormCIDError').css('display', 'none');

    $('#scheduleNonDoctorDateTime').val(now)
    document.getElementById('scheduleNonDoctorDateTime').min = now;
    $('#scheduleNonDoctorComplaint').val('');
    $('#scheduleNonDoctorFormError').css('display', 'none');
}

$('#homeNav').click(() => {
    resetContainer();
    resetHomePage();
    showLoading();
    $.post('http://vc-medicrecord/fetchRecentMedicalRecordsData', JSON.stringify({}));
});

window.home = (item) => {
    if (item.type === "showMedicalInformationSystem") {
        item.isUIShown ? $('body').css('display', 'block') : $('body').css('display', 'none');
        if (!item.isUIShown) {
            return;
        }

        userJob = item.job;

        if(item.job === "non-doctor") {
            clearSchedulePage();
            clearScheduleForm();
            fetchDataSchedules();
            $('#homeNav').css('display', 'none');
            $('#searchPatientNav').css('display', 'none');
            $('#medicalRecordsNav').css('display', 'none');
            showContainer(createScheduleContainer);
            return;
        }

        $('#homeNav').css('display', 'block');
        $('#searchPatientNav').css('display', 'block');
        $('#medicalRecordsNav').css('display', 'block');
        $('#homeDetailMedicalRecord').css('display', 'none');

        $.post('http://vc-medicrecord/fetchRecentMedicalRecordsData', JSON.stringify({}));
        showLoading();
        resetContainer();
    }

    else if (item.type === "recentMedicalRecordsDataResponse") {
        showMedicalRecordsTable(item.medicalRecords);
        hideLoading();
        showContainer(homeContainer);
    }
    else if (item.type === "getDetailMedicalRecordsByIdResponse") {
        hideLoading();
        showDetailMedicalRecordsById(item.detailMedicalRecord);
    }
};