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

function deleteScheduleData(scheduleId) {
    $('#confirmationModal').modal('hide');
    $.post('http://vc-medicrecord/deleteScheduleId', JSON.stringify({ scheduleId }));
    showLoading();
}

$('#scheduleNav').click(() => {
    clearSchedulePage();
    clearScheduleForm();
    fetchDataSchedules();
    showContainer(createScheduleContainer);
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

window.schedule = (item) => {
    if (item.type === "schedulesDataResponse") {
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
        $('#scheduleGender').val((parseInt(item.userData[0].gender) === 0) ? "0" : "1");
        $('#schedulePhoneNumber').val(item.userData[0].phonenumber);
    }
    else if (item.type === "newScheduleResponse") {
        clearSchedulePage();
        fetchDataSchedules();
        clearScheduleForm();
        showContainer(createScheduleContainer);
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
};