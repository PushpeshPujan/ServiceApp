var mysql = require('mysql');

/*var connection = mysql.createConnection({
    host: 'localhost',
    user: 'serviceappadmin',
    password: 'simpsoft123',
    database: 'serviceapp',
    debug: false,
});*/
const passwordSolt = "dfcjhghj"
// var connection = mysql.createConnection({
//     host: 'richasundrani.com',
//     user: 'serviceappdbadmin',
//     password: 'simpsoft123',
//     database: 'serviceapp',
//     debug: false,
// });
//const passwordSolt = "dfcjhghj"
var connection = mysql.createConnection({
    host: '18.191.252.164',
    user: 'root',
    password: 'Simpsoft@123',
    database: 'serviceapp',
    debug: false,
});

const fetchData = async (sql) => {
    return new Promise(function (resolve, reject) {connection.query(sql, {},(err, result)=>{console.log(err);err?reject({ msg: "internal server error", code: 700,data:err }):result?resolve(result):reject({ msg: "No data available", code: 202 })});})
}
const updateSocialSignin=async(oo)=>{
const sql=`INSERT INTO user (userid, password, firstname, lastname, profileimage, role, issocialsignin, gmail) VALUES ("${oo.userid}","${oo.password}","${oo.firstname}","${oo.lastname}","${oo.profileimage}","consumer",1,"${oo.userid}")  ON DUPLICATE KEY UPDATE password="${oo.password}", firstname="${oo.firstname}", lastname="${oo.lastname}", profileimage="${oo.profileimage}"`

return await fetchData(sql);
}
const updatePaymentData = async (data) => {
const sql =`UPDATE appointment SET paymentdata='${JSON.stringify(data)}',paidamount=${data.amount}, paymentstatus =${data.paymentStatus} WHERE eventid='${data.eventId}'`
return await fetchData(sql);
}
const varifyUser = async (user, pass,isSocialSignin) => {
var sql=`SELECT * FROM user WHERE userid="${user}" AND password=MD5(CONCAT('${passwordSolt}', "${pass}"));`;
if(isSocialSignin == "yes"){
    sql=`SELECT * FROM user WHERE userid="${user}";`;
}

    return await fetchData(sql);
}
const fetchCalendarById = async (ids) => {
    const sql = `SELECT calendarid FROM user WHERE id IN(${ids.join(",")})`;
        return await fetchData(sql);
    }
const fetchGmailById= async (ids) => {
    const sql = `SELECT id, gmail, firstname, lastname FROM user WHERE id IN(${ids.join(",")})`;
    return await fetchData(sql);
}
const getFavorites = async (consumerid, startCount = 0, endCount = 10) => {
    const sql = `SELECT m.providerid, m.consumerid , c.userid, c.password, c.firstname, c.lastname,c.calendarid, c.role,c.profileimage, c.gmail,c.specialization,c.degree,c.fees, m.isfavorite FROM favoriteandrating m INNER JOIN user c ON c.id = m.providerid WHERE m.consumerid = ${consumerid} AND m.isfavorite > 0`
    return await fetchData(sql);
}
const searchProvider=async(searchStr)=>{
    const sql = `SELECT c.id, c.firstname, c.lastname, c.profileimage,c.calendarid, c.specialization, c.degree, c.fees, c.latitude, c.longitude, c.whatsappno, c.videocallurl ,m.isfavorite FROM user c LEFT JOIN favoriteandrating m ON c.id = m.providerid WHERE c.firstname LIKE '%${searchStr}%' OR c.lastname LIKE '%${searchStr}%' OR c.lastname LIKE '%${searchStr}%' OR c.specialization LIKE '%${searchStr}%' OR c.degree LIKE '%${searchStr}%'`;
    return await fetchData(sql);
}
const fetchDoctorProfile = async ( consumerId, providerId) => {
    const sql = `SELECT c.id, c.firstname, c.lastname, c.profileimage,c.calendarid,c.gmail, c.specialization, c.degree, c.fees, c.experience, c.latitude, c.longitude, c.whatsappno, c.videocallurl, c.extrainfo ,m.isfavorite FROM user c LEFT JOIN favoriteandrating m ON c.id = m.providerid AND m.consumerid = ${consumerId} WHERE c.id=${providerId}`
    return await fetchData(sql);
}
const updateFavorite = async (consumerId, providerId) => {
    const sql = `INSERT INTO favoriteandrating (providerid, consumerid, isfavorite)  VALUES (${providerId}, ${consumerId}, 1) ON DUPLICATE KEY UPDATE isfavorite = (case when isfavorite = 0 or isfavorite is null  then 1 else 0 end)`
    return await fetchData(sql);
}
const getAppointmentsByConsumerProviderID = async (consumerid,providerId, role,startCount = 0, endCount = 10) => {
   // const cond = `m.consumerid = ${consumerid} and m.providerid = ${providerId}`
   const cond = `m.consumerid = ${consumerid}`
    //const joinCond=`c.id = m.consumerid`
    const joinCond=role!="doctor"?`c.id = m.providerid`:`c.id = m.consumerid`
    const sql = `SELECT m.providerid,m.answer, m.consumerid , REPLACE(m.appointmentdate," ","T") as appointmentdate, m.paymentstatus,m.appointmentstatus, m.paidamount, m.dueamount,m.conferenceurl,m.eventid, c.extrainfo, c.profileimage, c.firstname, c.lastname, c.specialization,c.degree,c.fees, d.isfavorite FROM appointment m INNER JOIN user c ON ${joinCond} LEFT JOIN favoriteandrating d ON c.id = d.providerid AND m.consumerid = d.consumerid WHERE ${cond} ORDER BY appointmentdate DESC`
    console.log("sql getAppointmentsByConsumerProviderID ",sql)
    return await fetchData(sql);
}
const getAppointments = async (consumerid,role, startCount = 0, endCount = 10) => {
    const cond = role!="doctor"?`m.consumerid = ${consumerid}`:`m.providerid = ${consumerid}`
    const joinCond=role!="doctor"?`c.id = m.providerid`:`c.id = m.consumerid`
    const sql = `SELECT m.providerid,m.answer, m.consumerid , REPLACE(m.appointmentdate," ","T") as appointmentdate, m.paymentstatus,m.appointmentstatus, m.paidamount, m.dueamount,m.conferenceurl,m.eventid, c.extrainfo, c.profileimage, c.firstname, c.lastname, c.specialization,c.degree,c.fees, d.isfavorite FROM appointment m INNER JOIN user c ON ${joinCond} LEFT JOIN favoriteandrating d ON c.id = d.providerid AND m.consumerid = d.consumerid WHERE ${cond} ORDER BY appointmentdate DESC`
   console.log("sql  ",sql)
    return await fetchData(sql);
}
const updateAnswer=async(eventId,data)=>{
const sql=`UPDATE appointment SET answer='${JSON.stringify(data)}' WHERE eventid="${eventId}"`
return await fetchData(sql);
}
const makeAppointment = async (consumerId, providerId,appointmentDateTime,eventId) => {
    const sql = `INSERT IGNORE INTO appointment (providerid, consumerid, appointmentdate,eventid)  VALUES (${providerId}, ${consumerId}, "${appointmentDateTime}","${eventId}") `
    return await fetchData(sql);
}
const updateAppointMentStatus=async(eventId,status,urls)=>{
    const sql = urls && urls.length > 0?`UPDATE appointment SET appointmentstatus="${status}", conferenceurl="${urls.join(",")}" WHERE eventid="${eventId}"`:`UPDATE appointment SET appointmentstatus="${status}" WHERE eventid="${eventId}"`
    return await fetchData(sql);

}
const insertAttachment=async(eventId,attachmentId,mimeType,fileName,userId)=>{
const sql=`INSERT IGNORE INTO attachments (eventid, attachmentid, mimetype, title, owner) VALUES("${eventId}","${attachmentId}","${mimeType}","${fileName}","${userId}")`;
return await fetchData(sql);
}
const  attachmentsByEventId=async(eventId)=>{
    const sql=`SELECT attachmentid,mimetype,title,owner FROM attachments WHERE  eventid="${eventId}" AND isactive =1` 
    return await fetchData(sql);
}
const getIdByEventId= async(eventId)=>{
    var sql = `SELECT providerid, consumerid FROM appointment WHERE eventid="${eventId}"` 
    return await fetchData(sql);
}
const fetchScheduleByDay=async(providerId,dayId)=>{
    var sql = `SELECT * FROM timescheduled WHERE userid=${providerId} and dayid=${dayId} ` 
    return await fetchData(sql);
}
module.exports = {
    varifyUser,
    getAppointments,
    getFavorites,
    updateFavorite,
    fetchDoctorProfile,
    makeAppointment,
    searchProvider,
    fetchGmailById,
    fetchCalendarById,
    getIdByEventId,
    updateAppointMentStatus,
    insertAttachment,
    attachmentsByEventId,
    updateSocialSignin,
    updateAnswer,
    updatePaymentData,
    fetchScheduleByDay,
    getAppointmentsByConsumerProviderID,
}
