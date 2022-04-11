local cacheValidateUntil = os.date("*t")
local expiryMinutes = 60
local recentMedicalRecordsData = {}
local db = exports.ghmattimysql

function dump(o)
    if type(o) == 'table' then
       local s = '{ '
       for k,v in pairs(o) do
          if type(k) ~= 'number' then k = '"'..k..'"' end
          s = s .. '['..k..'] = ' .. dump(v) .. ','
       end
       return s .. '} '
    else
       return tostring(o)
    end
end

RegisterServerEvent('vc-medicalrecord:submitEditPatientMedicalRecordData')
AddEventHandler('vc-medicalrecord:submitEditPatientMedicalRecordData', function (data) 
    if string.len(data.title) > 80 or string.len(data.complaint) > 5000 or string.len(data.diagnosis) > 5000 then
        return
    end

    local src = source
    local success = false
    local query = "UPDATE medicalrecords SET title = ?, complaint = ?, diagnosis = ? WHERE id = ?"

    db:execute(query, { data.title, data.complaint, data.diagnosis, data.medicalRecordsId }, function (result) 
        if result ~= nil then
            success = true
        end

        TriggerClientEvent('vc-medicalrecord:submitEditHomeDetailRecordsByIdResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:submitEditHomeDetailRecordsById')
AddEventHandler('vc-medicalrecord:submitEditHomeDetailRecordsById', function (data) 
    if string.len(data.title) > 80 or string.len(data.complaint) > 5000 or string.len(data.diagnosis) > 5000 then
        return
    end

    local src = source
    local success = false
    local query = "UPDATE medicalrecords SET title = ?, complaint = ?, diagnosis = ? WHERE id = ?"

    db:execute(query, { data.title, data.complaint, data.diagnosis, data.medicalRecordsId }, function (result) 
        if result ~= nil then
            success = true
        end

        TriggerClientEvent('vc-medicalrecord:submitEditHomeDetailRecordsByIdResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:submitNonDoctorSchedule')
AddEventHandler('vc-medicalrecord:submitNonDoctorSchedule', function (data)
    if string.len(data.complaint) > 5000 then
        return
    end

    local src = source
    local user = exports['vc-base']:getModule('Player'):GetUser(src)
    local char = user:getCurrentCharacter()
    local success = false
    local query = "INSERT INTO schedule (cid, datetime, complaint, createdAt) VALUES (?, ?, ?, ?)"

    db:execute(query, { char.id, data.dateTime, data.complaint, os.time() }, function (result)
        if result ~= nil then
            success = true
        end

        TriggerClientEvent('vc-medicalrecord:submitNonDoctorScheduleResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:getNormalScheduleData')
AddEventHandler('vc-medicalrecord:getNormalScheduleData', function ()
    local src = source
    local user = exports['vc-base']:getModule('Player'):GetUser(src)
    local char = user:getCurrentCharacter()
    local query = "SELECT datetime FROM schedule WHERE schedule.cid = ?"

    db:execute(query, { char.id }, function (result)
        TriggerClientEvent('vc-medicalrecord:normalScheduleDataResponse', src, result)
    end)
end)

RegisterServerEvent('vc-medicalrecord:getDetailMedicalRecordsById')
AddEventHandler('vc-medicalrecord:getDetailMedicalRecordsById', function (data)
    local src = source
    local query = "SELECT medicalrecords.id as medicalRecordsId, title, complaint, diagnosis, CONCAT(characters.first_name, ' ', characters.last_name) AS doctorName FROM medicalrecords JOIN characters ON medicalrecords.id_doctor = characters.id WHERE medicalrecords.cid = ? ORDER BY createdAt DESC LIMIT 50"

    db:execute(query, { data.cid }, function (result)
        TriggerClientEvent('vc-medicalrecord:getDetailMedicalRecordsByIdResponse', src, result)
    end)
end)

RegisterServerEvent('vc-medicalrecord:deleteMedicalRecordByID')
AddEventHandler('vc-medicalrecord:deleteMedicalRecordByID', function (data)
    local src = source
    local success = false
    local query = "DELETE FROM medicalrecords WHERE medicalrecords.id = ?"

    db:execute(query, { data.medicalRecordsId }, function (result)
        if result ~= nil then
            success = true
        end
        recentMedicalRecordsData = {}

        TriggerClientEvent('vc-medicalrecord:deleteMedicalRecordByIDResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:createNewMedicalRecordByCID')
AddEventHandler('vc-medicalrecord:createNewMedicalRecordByCID', function (data)
    if string.len(data.title) > 80 or string.len(data.complaint) > 5000 or string.len(data.diagnosis) > 5000 then
        return
    end

    local src = source
    local user = exports['vc-base']:getModule('Player'):GetUser(src)
    local char = user:getCurrentCharacter()
    local success = false
    local query = "INSERT INTO medicalrecords (cid, title, complaint, diagnosis, id_doctor, createdAt) VALUES (?, ?, ?, ?, ?, ?)"

    db:execute(query, { tonumber(data.cid), data.title, data.complaint, data.diagnosis, char.id, os.time() }, function (result)
        if result ~= nil then
            success = true
        end
        recentMedicalRecordsData = {}

        TriggerClientEvent('vc-medicalrecord:createNewMedicalRecordByCIDResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:getUserMedicalData')
AddEventHandler('vc-medicalrecord:getUserMedicalData', function (data)
    local src = source
    local query = "SELECT CONCAT(first_name, ' ', last_name) as fullname, gender, phone_number as phonenumber FROM characters WHERE id = ?"
    local cid = tonumber(data.cid)

    db:execute(query, { cid }, function (result)
        TriggerClientEvent('vc-medicalrecord:getUserMedicalDataResponse', src, result)
    end)
end)

RegisterServerEvent('vc-medicalrecord:fetchMedicalRecordsByQuery')
AddEventHandler('vc-medicalrecord:fetchMedicalRecordsByQuery', function (data)
    local src = source
    local query = "SELECT CONCAT(first_name, ' ', last_name) as fullname, phone_number as phonenumber, title, diagnosis, characters.id as cid, medicalrecords.id as id FROM medicalrecords JOIN characters ON medicalrecords.cid = characters.id WHERE characters.id = ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? LIMIT 50"
    local cid = tonumber(data.query) or ''

    db:execute(query, { cid, data.query .. '%', '%' .. data.query .. '%', '%' .. data.query }, function (result)
        TriggerClientEvent('vc-medicalrecord:medicalRecordsResponse', src, result)
    end)
end)

RegisterServerEvent('vc-medicalrecord:fetchMedicalRecordsData')
AddEventHandler('vc-medicalrecord:fetchMedicalRecordsData', function ()
    local src = source
    local query = "SELECT CONCAT(first_name, ' ', last_name) as fullname, phone_number as phonenumber, title, diagnosis, characters.id as cid, medicalrecords.id as id FROM medicalrecords JOIN characters ON medicalrecords.cid = characters.id ORDER BY medicalrecords.createdAt DESC LIMIT 50"

    db:execute(query, nil, function (result)
        TriggerClientEvent('vc-medicalrecord:medicalRecordsResponse', src, result)
    end)
end)

RegisterServerEvent('vc-medicalrecord:postNewSchedule')
AddEventHandler('vc-medicalrecord:postNewSchedule', function (data)
    if string.len(data.complaint) > 5000 then
        return
    end

    local src = source
    local success = false
    local query = "INSERT INTO schedule (cid, datetime, complaint, createdAt) VALUES (?, ?, ?, ?)"

    db:execute(query, { data.cid, data.datetime, data.complaint, os.time() }, function (result)
        if result ~= nil then
            success = true
        end

        TriggerClientEvent('vc-medicalrecord:newScheduleResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:getUserData')
AddEventHandler('vc-medicalrecord:getUserData', function (data)
    local src = source
    local query = "SELECT CONCAT(first_name, ' ', last_name) as fullname, gender, phone_number as phonenumber FROM characters WHERE id = ?"

    db:execute(query, { data.cid }, function (result)
        TriggerClientEvent('vc-medicalrecord:scheduleUserDataResponse', src, result)
    end)
end)


RegisterServerEvent("vc-medicalrecord:deleteScheduleId")
AddEventHandler("vc-medicalrecord:deleteScheduleId", function(data) 
    local src = source
    local success = false
    local query = "DELETE FROM schedule WHERE schedule.id = ?"

    db:execute(query, { data.scheduleId }, function (result)
        if result ~= nil then
            success = true
        end

        TriggerClientEvent("vc-medicalrecord:deleteScheduleIdResponse", src, success)
    end)
end)

RegisterServerEvent("vc-medicalrecord:fetchSchedulesData")
AddEventHandler("vc-medicalrecord:fetchSchedulesData", function ()
    local src = source

    local query = "SELECT schedule.id as scheduleId, CONCAT(first_name, ' ', last_name) as fullname, phone_number as phonenumber, datetime, complaint FROM schedule JOIN characters ON schedule.cid = characters.id ORDER BY schedule.createdAt DESC LIMIT 50"
    db:execute(query, nil, function(result) 
        TriggerClientEvent('vc-medicalrecord:schedulesDataResponse', src, result)
    end)
end)

RegisterServerEvent("vc-medicalrecord:fetchRecentMedicalRecordsData")
AddEventHandler("vc-medicalrecord:fetchRecentMedicalRecordsData", function()
    local src = source

    if isCacheInvalidated() then
        local query = "SELECT patient.id as cid, CONCAT(patient.first_name, ' ', patient.last_name) AS fullname, patient.phone_number as phonenumber, patient.dob AS dob, patient.gender AS gender, title, CONCAT(doctor.first_name, ' ', doctor.last_name) as doctorName FROM medicalrecords JOIN characters AS patient ON medicalrecords.cid = patient.id JOIN characters as doctor ON medicalrecords.id_doctor = doctor.id ORDER BY medicalrecords.createdAt DESC LIMIT 10;"
        db:execute(query, nil, function (result)
            local now = os.time()
            recentMedicalRecordsData = result
            now = now + expiryMinutes
            cacheValidateUntil = now

            TriggerClientEvent('vc-medicalrecord:recentMedicalRecordsDataResponse', src, result)
        end)
        return
    end

    TriggerClientEvent('vc-medicalrecord:recentMedicalRecordsDataResponse', src, recentMedicalRecordsData)
end)

RegisterServerEvent('vc-medicalrecord:fetchPatientsData')
AddEventHandler('vc-medicalrecord:fetchPatientsData', function(data)
    local src = source

    local cid = tonumber(data.query) or ''
    local query = "SELECT id, CONCAT(first_name, ' ', last_name) AS fullname, dob, phone_number as phonenumber, gender FROM characters WHERE id = ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) LIKE ? LIMIT 50"

    db:execute(query, { cid, data.query .. '%', '%' .. data.query .. '%', '%' .. data.query }, function (result)
        TriggerClientEvent('vc-medicalrecord:patientsDataResponse', src, result)
    end)
end)

function isCacheInvalidated()
    if #recentMedicalRecordsData == 0 then
        return true
    end

    local now = os.time()

    return now > cacheValidateUntil
end

RegisterServerEvent('vc-medicalrecord:postMedicalRecordData')
AddEventHandler('vc-medicalrecord:postMedicalRecordData', function (data)
    if string.len(data.title) > 80 or string.len(data.complaint) > 5000 or string.len(data.diagnosis) > 5000 then
        return
    end

    local src = source
    local user = exports['vc-base']:getModule('Player'):GetUser(src)
    local char = user:getCurrentCharacter()
    local success = false
    local query = "INSERT INTO medicalrecords (cid, title, complaint, diagnosis, id_doctor, createdAt) VALUES (?, ?, ?, ?, ?, ?)"

    db:execute(query, { data.cid, data.title, data.complaint, data.diagnosis, char.id, os.time() }, function (result)
        if result ~= nil then
            success = true
        end

        recentMedicalRecordsData = {}

        TriggerClientEvent('vc-medicalrecord:postMedicalRecordResponse', src, success)
    end)
end)

RegisterServerEvent('vc-medicalrecord:fetchDetailMedicalRecordsData')
AddEventHandler('vc-medicalrecord:fetchDetailMedicalRecordsData', function (data) 
    local src = source
    local query = "SELECT medicalrecords.id as medicalRecordsId, title, complaint, diagnosis, CONCAT(characters.first_name, ' ', characters.last_name) AS doctorName FROM medicalrecords JOIN characters ON medicalrecords.id_doctor = characters.id WHERE medicalrecords.cid = ? ORDER BY createdAt DESC LIMIT 50"

    db:execute(query, { data.id }, function (result)
        TriggerClientEvent('vc-medicalrecord:detailMedicalRecordsResponse', src, result)
    end)
end)
