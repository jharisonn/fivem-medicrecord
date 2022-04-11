local job = "non-doctor"

RegisterCommand("showMed", function()
    Citizen.CreateThread(function() 
        ToggleUI(true)
    end)
end)

RegisterNUICallback("close", function()
    ToggleUI(false)
end)

RegisterNetEvent("vc-medicalrecord:submitEditPatientMedicalRecordDataResponse")
AddEventHandler("vc-medicalrecord:submitEditPatientMedicalRecordDataResponse", function(data) 
    SendNUIMessage({
        type = "submitEditPatientMedicalRecordDataResponse"
    })
end)

RegisterNUICallback("submitEditPatientMedicalRecordData", function (data) 
    TriggerServerEvent("vc-medicalrecord:submitEditPatientMedicalRecordData", data)
end)

RegisterNUICallback("submitEditHomeDetailRecordsById", function(data)
    TriggerServerEvent("vc-medicalrecord:submitEditHomeDetailRecordsById", data)
end)

RegisterNetEvent('vc-medicalrecord:submitEditHomeDetailRecordsByIdResponse')
AddEventHandler('vc-medicalrecord:submitEditHomeDetailRecordsByIdResponse', function (data) 
    SendNUIMessage({
        type = 'submitEditHomeDetailRecordsByIdResponse'
    })
end)

RegisterNetEvent('vc-medicalrecord:submitNonDoctorScheduleResponse')
AddEventHandler('vc-medicalrecord:submitNonDoctorScheduleResponse', function (response)
    SendNUIMessage({
        type = 'submitNonDoctorScheduleResponse',
        response = response
    })
end)

RegisterNUICallback('submitNonDoctorSchedule', function (data)
    TriggerServerEvent('vc-medicalrecord:submitNonDoctorSchedule', data)
end)

RegisterNetEvent('vc-medicalrecord:normalScheduleDataResponse')
AddEventHandler('vc-medicalrecord:normalScheduleDataResponse', function (queue)
    SendNUIMessage({
        type = 'normalScheduleDataResponse',
        queue = queue
    })
end)

RegisterNUICallback('getNormalScheduleData', function ()
    TriggerServerEvent('vc-medicalrecord:getNormalScheduleData')
end)

RegisterNUICallback('getDetailMedicalRecordsById', function (data)
    TriggerServerEvent('vc-medicalrecord:getDetailMedicalRecordsById', data)
end)

RegisterNetEvent('vc-medicalrecord:getDetailMedicalRecordsByIdResponse')
AddEventHandler('vc-medicalrecord:getDetailMedicalRecordsByIdResponse', function (detailMedicalRecord)
    SendNUIMessage({
        type = 'getDetailMedicalRecordsByIdResponse',
        detailMedicalRecord = detailMedicalRecord
    })
end)

RegisterNUICallback('deleteMedicalRecordByID', function (data)
    TriggerServerEvent('vc-medicalrecord:deleteMedicalRecordByID', data)
end)

RegisterNetEvent('vc-medicalrecord:deleteMedicalRecordByIDResponse')
AddEventHandler('vc-medicalrecord:deleteMedicalRecordByIDResponse', function (response)
    SendNUIMessage({
        type = 'deleteMedicalRecordByIDResponse',
        response = response
    })
end)

RegisterNetEvent('vc-medicalrecord:createNewMedicalRecordByCIDResponse')
AddEventHandler('vc-medicalrecord:createNewMedicalRecordByCIDResponse', function (response)
    SendNUIMessage({
        type = 'createNewMedicalRecordByCIDResponse',
        response = response
    })
end)

RegisterNUICallback('createNewMedicalRecordByCID', function (data)
    TriggerServerEvent('vc-medicalrecord:createNewMedicalRecordByCID', data)
end)

RegisterNetEvent("vc-medicalrecord:getUserMedicalDataResponse")
AddEventHandler("vc-medicalrecord:getUserMedicalDataResponse", function (userData)
    SendNUIMessage({
        type = "getUserMedicalDataResponse",
        userData = userData
    })
end)

RegisterNUICallback('getUserMedicalData', function (data)
    TriggerServerEvent('vc-medicalrecord:getUserMedicalData', data)
end)

RegisterNUICallback('searchMedicalRecords', function (data)
    TriggerServerEvent('vc-medicalrecord:fetchMedicalRecordsByQuery', data)
end)

RegisterNetEvent('vc-medicalrecord:medicalRecordsResponse')
AddEventHandler('vc-medicalrecord:medicalRecordsResponse', function (medicalRecords)
    SendNUIMessage({
        type = 'medicalRecordsResponse',
        medicalRecords = medicalRecords
    })
end)

RegisterNUICallback('fetchMedicalRecordsData', function ()
    TriggerServerEvent('vc-medicalrecord:fetchMedicalRecordsData')
end)

RegisterNetEvent('vc-medicalrecord:newScheduleResponse')
AddEventHandler('vc-medicalrecord:newScheduleResponse', function (response)
    SendNUIMessage({
        type = 'newScheduleResponse',
        response = response
    })
end)

RegisterNUICallback('postNewSchedule', function (data)
    TriggerServerEvent('vc-medicalrecord:postNewSchedule', data)
end)

RegisterNetEvent("vc-medicalrecord:scheduleUserDataResponse")
AddEventHandler("vc-medicalrecord:scheduleUserDataResponse", function (userData)
    SendNUIMessage({
        type = "scheduleUserDataResponse",
        userData = userData
    })
end)

RegisterNUICallback("getUserData", function (data)
    TriggerServerEvent("vc-medicalrecord:getUserData", data)
end)

RegisterNUICallback("deleteScheduleId", function (data)
    TriggerServerEvent("vc-medicalrecord:deleteScheduleId", data)
end)

RegisterNetEvent("vc-medicalrecord:deleteScheduleIdResponse")
AddEventHandler("vc-medicalrecord:deleteScheduleIdResponse", function (response)
    SendNUIMessage({
        type = "deleteScheduleIdResponse",
        response = response
    })
end)

RegisterNUICallback("getSchedulesData", function() 
    TriggerServerEvent("vc-medicalrecord:fetchSchedulesData")
end)

RegisterNetEvent("vc-medicalrecord:schedulesDataResponse")
AddEventHandler("vc-medicalrecord:schedulesDataResponse", function (schedules)
    SendNUIMessage({
        type = "schedulesDataResponse",
        schedules = schedules
    })
end)

RegisterNUICallback("submitMedicalRecordData", function(data)
    TriggerServerEvent('vc-medicalrecord:postMedicalRecordData', data)
end)

RegisterNetEvent("vc-medicalrecord:detailMedicalRecordsResponse")
AddEventHandler("vc-medicalrecord:detailMedicalRecordsResponse", function (medicalRecords)
    SendNUIMessage({
        type = "detailMedicalRecordsResponse",
        medicalRecords = medicalRecords
    })
end)

RegisterNUICallback("getDetailMedicalRecordsData", function(data)
    TriggerServerEvent('vc-medicalrecord:fetchDetailMedicalRecordsData', data)
end)

RegisterNUICallback("searchPatients", function(data)
    TriggerServerEvent('vc-medicalrecord:fetchPatientsData', data)
end)

RegisterNetEvent("vc-medicalrecord:patientsDataResponse")
AddEventHandler("vc-medicalrecord:patientsDataResponse", function(patients)
    SendNUIMessage({
        type = "patientsDataResponse",
        patients = patients
    })
end)

RegisterNetEvent("vc-medicalrecord:postMedicalRecordResponse")
AddEventHandler("vc-medicalrecord:postMedicalRecordResponse", function(response)
    SendNUIMessage({
        type = "postMedicalRecordResponse",
        response = response
    })
end)

RegisterNUICallback("fetchRecentMedicalRecordsData", function()
    TriggerServerEvent('vc-medicalrecord:fetchRecentMedicalRecordsData')
end)

RegisterNetEvent("vc-medicalrecord:recentMedicalRecordsDataResponse")
AddEventHandler("vc-medicalrecord:recentMedicalRecordsDataResponse", function(medicalRecords)
    SendNUIMessage({
        type = "recentMedicalRecordsDataResponse",
        medicalRecords = medicalRecords
    })
end)

RegisterNetEvent('vector:unstuck')
AddEventHandler('vector:unstuck', function()
    ToggleUI(false)
end)

RegisterNetEvent("vc-jobmanager:playerBecameJob")
AddEventHandler("vc-jobmanager:playerBecameJob", function(jobpassed)
    if jobpassed == "doctor" or jobpassed == "ems" then 
        job = "doctor"
        return
    end
    job = "non-doctor"
end)

function ToggleUI(isUIShown)
    SetNuiFocus(isUIShown, isUIShown)
    SendNUIMessage({
        type = "showMedicalInformationSystem",
        job = job,
        isUIShown = isUIShown
    })
end
