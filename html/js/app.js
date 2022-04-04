let recentMedicalRecordsData;
let homeDetailMedicalRecordByIdList;
let patientsSearchData;
let userJob;
let patientDetailMedicalRecordByIdList;
const containersId = [ 
    {containerId: '#homeContainer', navId: '#homeNav'}, 
    {containerId: '#searchPatientsContainer', navId: '#searchPatientNav'},
    {containerId: '#scheduleContainer', navId: '#scheduleNav'},
    {containerId: '#medicalRecordsContainer', navId: '#medicalRecordsNav'}
];
const homeContainer = 0;
const searchPatientsContainer = 1;
const createScheduleContainer = 2;
const medicalRecordsContainer = 3;

function resetContainer() {
    containersId.forEach((container) => {
        $(container.containerId).css('display', 'none');
        $(container.navId).removeClass('text-secondary');
        $(container.navId).addClass('text-white');
    });
}

function showContainer(type) {
    resetContainer();
    $(containersId[type].containerId).css('display', 'block');
    $(containersId[type].navId).addClass('text-secondary');
}

function hideLoading() {
    $('#loadingContainer').css('display', 'none');
}

function showLoading() {
    $('#loadingContainer').css('display', 'block');
}

function clearSearchPage() {
    $('#patientFormCards').css('display', 'none');
    $('#patientProfileCards').css('display', 'none');
    $('#searchNotFound').css('display', 'none');
    $('#successData').css('display', 'none');
    $('#patientDetailProfile').css('display', 'none');
}

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

function convertUNIXtoString(datetime) {
    const date = new Date(parseInt(datetime * 1000));

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()}`;
}

function deleteScheduleData(scheduleId) {
    $('#confirmationModal').modal('hide');
    $.post('http://vc-medicrecord/deleteScheduleId', JSON.stringify({ scheduleId }));
    showLoading();
}

function confirmDeleteScheduleData(scheduleId) {
    $('#modalBody').html("Are you sure want to delete patient's schedule?")
    $('#confirmationButtonSave').unbind();
    $('#confirmationButtonSave').click(() => deleteScheduleData(scheduleId));

    $('#confirmationModal').modal();
}

function showSchedulesData(schedules) {
    const parentTable = $('#scheduleParentTable');
    parentTable.css('display', 'none');
    const table = $('#schedulesTable');
    table.empty();
    
    let row = '';
    for(var i=0; i<schedules.length; i++) {
        row += 
        '<tr>' +
        '<th scope="row">' +
        (i+1) +
        '</th>' +
        '<td>' +
        schedules[i].fullname +
        '</td>' +
        '<td>' +
        schedules[i].phonenumber +
        '</td>' +
        '<td>' +
        convertUNIXtoString(schedules[i].datetime) +
        '</td>' +
        '<td>' +
        schedules[i].complaint +
        '</td>' +
        '<td>' +
        '<button onclick="confirmDeleteScheduleData('+ schedules[i].scheduleId +')" class="btn btn-vector-warning" type="button">DELETE</a>' +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    parentTable.css('display', 'block');
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

function showMedicalRecordsResponse(medicalRecords) {
    const table = $('#medicalRecordsTable');
    table.empty();

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
        '<button onclick="confirmDeleteMedicalRecordsData('+ medicalRecords[i].id +')" class="btn btn-vector-warning" type="button">DELETE</a>' +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#medicalRecordsTableParent').css('display', 'block');
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
}

function fetchMedicalRecordsData() {
    showLoading();
    $.post('http://vc-medicrecord/fetchMedicalRecordsData', JSON.stringify({}))
}

const submitMedicalRecord = (id) => () => {
    const title = $('#title').val();
    const complaint = $('#complaint').val();
    const diagnosis = $('#diagnosis').val();

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
    $('#gender').val((patientData.gender === 0) ? "0" : "1");
    $('#dateofbirth').val(patientData.dob);
    $('#phonenumber').val(patientData.phonenumber);
    $('#cid').val(patientData.id);

    $('#submitFormCards').unbind();
    $('#submitFormCards').click(() => {
        const title = $('#title').val();
        const complaint = $('#complaint').val();
        const diagnosis = $('#diagnosis').val();

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

    $('#detailImage').attr('src', (patientData.gender === 0) ? "https://bootdey.com/img/Content/avatar/avatar7.png" : "https://bootdey.com/img/Content/avatar/avatar3.png");
    $('#detailFullname').text(patientData.fullname);
    $('#detailGender').text((patientData.gender === 0) ? 'Male' : 'Female');
    $('#detailDOB').text(patientData.dob);
    $('#detailPhoneNumber').text(patientData.phonenumber);
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

function clearPatientDetailForm() {
    $('#patientDetailMedicalRecordTitle').val('');
    $('#patientDetailMedicalRecordComplaint').val('');
    $('#patientDetailMedicalRecordDiagnosis').val('');
    $('#patientDetailMedicalRecordDoctor').val('');
}

function showMedicalRecordsDataById(medicalRecordsId) {
    const patientDetail = patientDetailMedicalRecordByIdList.find((medicalRecord) => medicalRecord.medicalRecordsId === medicalRecordsId);
    clearPatientDetailForm();

    $('#patientDetailMedicalRecordTitle').val(patientDetail.title);
    $('#patientDetailMedicalRecordComplaint').val(patientDetail.complaint);
    $('#patientDetailMedicalRecordDiagnosis').val(patientDetail.diagnosis);
    $('#patientDetailMedicalRecordDoctor').val(patientDetail.doctorName);

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
        medicalRecords[i].title +
        '</td>' +
        '<td>' +
        medicalRecords[i].doctorName +
        '</td>' +
        '</tr>';
    }

    table.append(row);
    $('#patientDataProfileTable').css('display', 'block');
    $('#patientDetailProfile').css('display', 'block');
    $('#patientDetailMedicalRecordForm').css('display', 'none');
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
        card += getCardBody('Gender', (patients[i].gender === 0) ? 'Male' : 'Female');
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

function onMedicalRecordDataClick(cid) {
    resetHomePage();
    const patientData = recentMedicalRecordsData.find((medicalRecords) => medicalRecords.cid === cid);
    $('#homeDetailImage').attr('src', (patientData.gender === 0) ? "https://bootdey.com/img/Content/avatar/avatar7.png" : "https://bootdey.com/img/Content/avatar/avatar3.png");
    $('#homeDetailFullname').text(patientData.fullname);
    $('#homeDetailGender').html((patientData.gender === 0) ? "Male" : "Female");
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

function clearHomeDetailMedicalRecordsByIdForm() {
    $('#homeDetailMedicalRecordTitle').val('');
    $('#homeDetailMedicalRecordComplaint').val('');
    $('#homeDetailMedicalRecordDiagnosis').val('');
    $('#homeDetailMedicalRecordDoctor').val('');
}

function showDetailMedicalRecordsByIdForm(medicalRecordsId) {
    const detailMedicalRecordsById = homeDetailMedicalRecordByIdList.find((medicalRecord) => medicalRecord.medicalRecordsId === medicalRecordsId);
    clearHomeDetailMedicalRecordsByIdForm();
    $('#homeDetailTableParent').css('display', 'none');

    $('#homeDetailMedicalRecordTitle').val(detailMedicalRecordsById.title);
    $('#homeDetailMedicalRecordComplaint').val(detailMedicalRecordsById.complaint);
    $('#homeDetailMedicalRecordDiagnosis').val(detailMedicalRecordsById.diagnosis);
    $('#homeDetailMedicalRecordDoctor').val(detailMedicalRecordsById.doctorName);

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

document.onreadystatechange = () => {
    if(document.readyState === "complete") {
        window.addEventListener('message', (event) => {
            var item = event.data;
            if (!item) {
                return;
            }

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
            else if (item.type === "patientsDataResponse") {
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
            else if (item.type === "schedulesDataResponse") {
                showSchedulesData(item.schedules);
                hideLoading();
            }
            else if (item.type === "deleteScheduleIdResponse") {
                fetchDataSchedules();
                hideLoading();
            }
            else if (item.type === "scheduleUserDataResponse") {
                if (item.userData.length === 0) {
                    $('#scheduleFullname').val('');
                    $('#schedulePhoneNumber').val('');
                    $('#scheduleFormCIDError').css('display', 'block');
                    return;
                }
                $('#scheduleResetSearchCID').css('display', 'block');
                $('#scheduleSearchCID').css('display', 'none');
                $('#scheduleCID').prop('disabled', true);

                $('#scheduleFullname').val(item.userData[0].fullname);
                $('#scheduleGender').val((item.userData[0].gender === 0) ? "0" : "1");
                $('#schedulePhoneNumber').val(item.userData[0].phonenumber);
            }
            else if (item.type === "newScheduleResponse") {
                clearSchedulePage();
                fetchDataSchedules();
                clearScheduleForm();
                showContainer(createScheduleContainer);
            }
            else if (item.type === "medicalRecordsResponse") {
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
                $('#medicalRecordGender').val((item.userData[0].gender === 0) ? "0" : "1");
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
            else if (item.type === "normalScheduleDataResponse") {
                if (item.queue.length === 0) {
                    $('#scheduleHeader').css('display', 'flex');
                    hideLoading();
                    return;
                }

                const schedule = convertUNIXtoString(item.queue[0].datetime);

                $('#createSchedule').css('display', 'none');
                $('#scheduleHeader').css('display', 'flex');
                $('#queueSection').css('display', 'block');
                $('#queueNumber').text(`${schedule} GMT +7`);
                hideLoading();
            }
            else if (item.type === "submitNonDoctorScheduleResponse") {
                clearSchedulePage();
                clearScheduleForm();
                hideLoading();
                $('#createSchedule').css('display', 'none');
                $('#successSubmitNonDoctorSection').css('display', 'block');
                showContainer(createScheduleContainer);
            }
        });
    }
};

function toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes());
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

function submitSchedule() {
    const datetime = new Date($('#scheduleDateTime').val()).valueOf() / 1000;

    const data = {
        cid: $('#scheduleCID').val(),
        datetime,
        complaint: $('#scheduleComplaint').val()
    };

    $.post('http://vc-medicrecord/postNewSchedule', JSON.stringify(data));
    $('#confirmationModal').modal('hide');
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

function submitNonDoctorSchedule() {
    const dateTime = new Date($('#scheduleNonDoctorDateTime').val()).valueOf() / 1000;
    const complaint = $('#scheduleNonDoctorComplaint').val();

    const data = {
        dateTime,
        complaint
    }

    showLoading();
    $.post('http://vc-medicrecord/submitNonDoctorSchedule', JSON.stringify(data));
    $('#confirmationModal').modal('hide');
}

$(document).ready(function () {
    $('#homeNav').click(() => {
        resetContainer();
        resetHomePage();
        showLoading();
        $.post('http://vc-medicrecord/fetchRecentMedicalRecordsData', JSON.stringify({}));
    });
    $('#searchPatientNav').click(() => {
        clearSearchPage();
        $('#searchPatientsQuery').val('');
        showContainer(searchPatientsContainer);
    });
    $('#scheduleNav').click(() => {
        clearSchedulePage();
        clearScheduleForm();
        fetchDataSchedules();
        showContainer(createScheduleContainer);
    });
    $('#medicalRecordsNav').click(() => {
        clearMedicalRecordsPage();
        fetchMedicalRecordsData();
        showContainer(medicalRecordsContainer);
    });
    $('#logoutButton').click(() => {
        recentMedicalRecordsData = {};
        patientsSearchData = {};
        $.post('http://vc-medicrecord/close', JSON.stringify({}));
    });
    $('#searchPatientsButton').click(() => {
        const query = $('#searchPatientsQuery').val();
        if (query === '') {
            return;
        }

        clearSearchPage();
        showLoading();
        $.post('http://vc-medicrecord/searchPatients',JSON.stringify({ query: query.toLowerCase() }));
    });
    $('#searchMedicalRecordsButton').click(() => {
        const query = $('#searchMedicalRecordsQuery').val();
        if (query === '') {
            return;
        }

        clearMedicalRecordsPage();
        showLoading();
        $.post('http://vc-medicrecord/searchMedicalRecords',JSON.stringify({ query }));
    });
    $('#createSchedule').click(() => {
        clearSchedulePage();
        clearScheduleForm();
        if (userJob === "non-doctor") {
            $('#scheduleNonDoctorFormCards').css('display', 'block');
            return;
        }

        $('#scheduleFormCards').css('display', 'block');
    });
    $('#submitNonDoctorSchedule').click(() => {
        const dateTime = new Date($('#scheduleNonDoctorDateTime').val()).valueOf() / 1000;
        const complaint = $('#scheduleNonDoctorComplaint').val();

        if (dateTime === '' || complaint === '' || complaint.length > 5000) {
            $('#scheduleNonDoctorFormError').css('display', 'block');

            return;
        }
        $('#modalBody').html("Are you sure want to create schedule?");

        $('#confirmationButtonSave').unbind();
        $('#confirmationButtonSave').click(() => submitNonDoctorSchedule());

        $('#confirmationModal').modal();
    });
    $('#scheduleSearchCID').click(() => {
        const cid = $('#scheduleCID').val();
        if (cid === '') {
            return;
        }
        
        const data = {
            cid
        };

        $.post('http://vc-medicrecord/getUserData', JSON.stringify(data));
    });
    $('#scheduleResetSearchCID').click(() => {
        $('#scheduleFullname').val('');
        $('#schedulePhoneNumber').val('');
        $('#scheduleResetSearchCID').css('display', 'none');
        $('#scheduleSearchCID').css('display', 'block');
        $('#scheduleCID').prop('disabled', false);
    });
    $("#submitSchedule").click(() => {
        if ($('#scheduleCID').val() === '' ||
             $('#scheduleFullname').val() === '' ||
             $('#schedulePhoneNumber').val() === '' ||
             $('#scheduleComplaint').val() === '' ||
             $('#scheduleComplaint').val().length > 5000 ||
             $('#scheduleDateTime').val() === '') {
            $('#scheduleFormError').css('display', 'block');
            return;
        }
        $('#scheduleFormError').css('display', 'none');
        $('#scheduleFormCIDError').css('display', 'none');

        $('#modalBody').html('Are you sure want to submit schedule?')
        $('#confirmationButtonSave').unbind();
        $('#confirmationButtonSave').click(() => submitSchedule());
        $('#confirmationModal').modal();
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
    })
});

document.onkeyup = function(data) {
    if(data.which == 27) {
        $.post('http://vc-medicrecord/close', JSON.stringify({}));
    }
}
