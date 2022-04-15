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

window.resetContainer = () => {
    containersId.forEach((container) => {
        $(container.containerId).css('display', 'none');
        $(container.navId).removeClass('text-secondary');
        $(container.navId).addClass('text-white');
    });
}

window.showContainer = (type) => {
    resetContainer();
    $(containersId[type].containerId).css('display', 'block');
    $(containersId[type].navId).addClass('text-secondary');
}

window.hideLoading = () => {
    $('#loadingContainer').css('display', 'none');
}

window.showLoading = () => {
    $('#loadingContainer').css('display', 'block');
}

window.convertUNIXtoString = (datetime) => {
    const date = new Date(parseInt(datetime * 1000));

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()}`;
}