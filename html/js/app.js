document.onreadystatechange = () => {
    if(document.readyState === "complete") {
        window.addEventListener('message', (event) => {
            var item = event.data;
            if (!item) {
                return;
            }

            home(item);
            patient(item);
            schedule(item);
            medicalRecords(item);
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

$(document).ready(function () {
    $('#logoutButton').click(() => {
        recentMedicalRecordsData = {};
        patientsSearchData = {};
        $.post('http://vc-medicrecord/close', JSON.stringify({}));
    });
});

document.onkeyup = function(data) {
    if(data.which == 27) {
        $.post('http://vc-medicrecord/close', JSON.stringify({}));
    }
}
