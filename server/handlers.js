const jwt = require('jsonwebtoken')
const moment = require('moment');
const { google } = require('googleapis');
const calendar = google.calendar('v3');
const stream = require('stream');
const jwtClient = require('./google')
const drive = google.drive('v3');
const { varifyUser, getAppointments,updatePaymentData, getFavorites, updateFavorite, fetchCalendarById,
  fetchDoctorProfile, searchProvider, makeAppointment,getAppointmentsByConsumerProviderID,fetchScheduleByDay,updateSocialSignin,updateAnswer, insertAttachment, attachmentsByEventId, fetchGmailById, getIdByEventId, updateAppointMentStatus } = require('./dbHandler')
const jwtKey = 'ytwqeyud!@#$%536767'
const jwtExpirySeconds = 3600 * 2
const generateToken = (data) => { return jwt.sign(data, jwtKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds }) }
const generateRandomNumber = (max = 5, min = 1) => { return parseFloat((Math.random() * (max - min) + min).toFixed(1)) };
const inviteOption = {
  auth: "", calendarId: 'primary',
  resource: {
    'summary': 'Meeting request', 'location': 'Our Office', 'description': 'Meeting request from customer to service provider',
    'start': { 'dateTime': "", 'timeZone': 'Asia/Kolkata', }, 'end': { 'dateTime': "", 'timeZone': 'Asia/Kolkata', }, "conferenceDataVersion": 1, 'recurrence': [],
    'attendees': "", "guestsCanSeeOtherGuests": true, "reminders": { "useDefault": false, "overrides": [{ "method": 'email', "minutes": 24 * 60 }, { "method": 'popup', "minutes": 10 }] }
  }, sendNotifications: true, conferenceDataVersion: 1, sendUpdates: "all"
}
const eventPatch = {
  "conferenceData": {
    "createRequest": {
      "requestId": "7qxalsvy0e",
      "conferenceSolutionKey": {
        "type": "hangoutsMeet"
      },
      "status": {
        "statusCode": "pending"
      }
    }
  }
}
const varifyToken = (token) => {
  const oo = {}
  oo.code = token ? 200 : 401
  try { oo.payload = (token ? jwt.verify(token, jwtKey) : null) }
  catch (e) { console.log(e); oo.code = e instanceof jwt.JsonWebTokenError ? 401 : 400 }
  return oo
}
const makeErrorObj = (code, Msg) => { return { "data": {}, "status": code, "errorMsg": Msg } }
const generateTimeSlot = async(providerId, durationxx, dates, calDate) => {
  // date = "2020-09-10"
  var rdate = moment(dates , 'YYYY-MM-DD');
      const daydata = await fetchScheduleByDay(providerId,rdate.day())
      console.log("daydata  ",daydata)
      const timeForm = daydata[0].timeform
      const timeTo = daydata[0].timeto
      const duration=parseInt(daydata[0].period)
      console.log("timeform",dates + 'T'+timeForm+'+05:30')
      console.log("timeTo",dates + 'T'+timeTo+'+05:30')
  date = moment(dates + 'T'+timeForm+'+05:30', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  const endTime  = moment(dates + 'T'+timeTo+'+05:30', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  //var diffduration = moment.duration(endTime.diff(date));
//var diff = diffduration.asMinutes();
  const diff = Math.abs(date.diff(endTime, 'minutes'))
  const numAppo = Math.floor(diff/duration)
  console.log("numAppo  ",numAppo,diff,duration,endTime.diff(date))
  const arr = []
  const calItems = calDate.items.map(d => {
    const oo = {}
    oo.isAvailable = false
    //d.description.toLocaleLowerCase() != "confirm";
    oo.start = moment(d.start.dateTime, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
    //console.log("oo.start",oo.start.format("H:mm"))
    //console.log("d.start.dateTime",d.start.dateTime)
    oo.end = moment(d.end.dateTime, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
    return oo

  })
  var calDate = null
  for (var i = 0; i < numAppo + 1; i++) {
    const d = {}
    var date2 = date.clone().add(duration, "minutes")
    
    if (calItems && calItems.length > 0) {
      calDate = calItems[0].start

    }
    console.log("calDate,date ", calDate, date)
    console.log("date < calDate ", (date < calDate))
    if (!calDate) {
      d.slot = date.format("H:mm")
      d.isAvailable = true;
      arr.push(d)
      console.log("calDate,arr ", calDate, arr)
      date.add(duration, "minutes")
    } else if (date < calDate) {
      d.slot = date.format("H:mm")
      d.isAvailable = true;
      arr.push(d)
      date.add(duration, "minutes")
    } else {
      d.slot = date.format("H:mm")
      //calItems[0].start.format("H:mm")
      d.isAvailable = false;
      arr.push(d)
     var ndate = date.clone()
     ndate.add(duration, "minutes")
     if(ndate >= calItems[0].end){
      date = calItems[0].end
      calItems.splice(0, 1)
      calDate = null
     }else{
      date.add(duration, "minutes")
     }
      
    }

  }


  return arr
}

const welcome = (req, res) => {

  res.send("welcome")
}
const signIn = async(req, res) => {
  //console.log("req.body",JSON.stringify(req.body))
  var userName=req.body.username
  if( req.body.siciallogin && req.body.siciallogin=="yes"){
    userName= req.body.userid
    const insertData = await updateSocialSignin(req.body).catch(err=>{
      console.log("errrrrr",JSON.stringify(err))
      res.send(makeErrorObj(205, "user not found"))
    })
    //console.log("insertData",JSON.stringify(insertData))
      if (!(insertData.affectedRows && insertData.affectedRows > 0)) {
        res.send(makeErrorObj(205, "user not found"))
        return 
      }
  }


  varifyUser(userName, req.body.password,req.body.siciallogin).then(data => {
    //console.log("varifyUser  ",JSON.stringify(data))
    if (data && data.length > 0) {
      const d = data[0];
      console.log("d",d)
      const token = generateToken({ username: userName, id: d.id,role:d.role });
      const body = {}
      body.data = {}
      body.status = 200
      body.data.id = d.id
      body.data.role=d.role
      body.data.gmail = d.gmail
      body.data.phone = d.phoneno
      body.data.sessionToken = token
      body.data.displayName = d.firstname + " " + d.lastname ? d.lastname : ""
      body.data.profilePicture = d.profileimage
      body.data.menuItems = [{ ItemLabel: "PROFILE", itemId: "", subMenu: [] }, { ItemLabel: "HOME", itemId: "", subMenu: [] }, { ItemLabel: "SEARCH", itemId: "", subMenu: [] }, { ItemLabel: "HISTORY", itemId: "", subMenu: [] }, { ItemLabel: "FAVORITE", itemId: "", subMenu: [] }]
      res.send(body)
    } else {
      const o = makeErrorObj(201, "user not found")
      res.send(o)
    }
  }).catch((error) => {
    console.log("error.....", error)
    const o = makeErrorObj(201, "user not found")
    res.send(o)
  })
}
const updatePayments = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    updatePaymentData(req.body).then(d=>{
      res.send({status:200,data:{}})
    }).catch(e=>{
      res.send({status:601,data:e,msg:"Can't update database"})
    })
  } else {
    res.send(makeErrorObj(o.code, "Authentication Failed"))
  }
}
const searchProviders = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    const { searchString } = req.body
    searchProvider(searchString).then(data => {
      const __arr = [];
      if (data && data.length > 0) {
        data.map(e => {
          const d = {}
          d.doctorId = e.id
          d.profileImage = e.profileimage
          d.calendarId = e.calendarid
          d.doctorName = e.firstname + " " + (e.lastname ? e.lastname : "")
          d.specialization = e.specialization && e.specialization != "" ? e.specialization.split(",") : []
          d.degree = e.degree && e.degree != "" ? e.degree.split(",") : []
          d.fees = e.fees && e.fees != "" ? e.fees : 0.0
          d.rating = generateRandomNumber();
          d.isFavorite = e.isfavorite && e.isfavorite > 0 ? true : false
          __arr.push(d)
        })
      }
      const dd = {}
      dd.status = 200
      dd.data = __arr
      //console.log(dd)
      res.send(dd)
    }).catch((error) => {
      const oo = makeErrorObj(700, "Internal Server error")
      res.send(oo)
    })
  } else {
    const oo = makeErrorObj(o.code, "Authentication Failed")
    res.send(oo)
  }
}

const getAllAttachment = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    attachmentsByEventId(req.body.eventId).then(data => {      
      res.send({status :200, data: data})
    }).catch(e=>{ res.send(makeErrorObj(700, "Internal Server error"))})
  }else{
    res.send(makeErrorObj(o.code, "Authentication Failed"))
  }
}
const fetchFavorites = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    getFavorites(o.payload.id).then(data => {
      const __arr = [];
      if (data && data.length > 0) {
        data.map(e => {
          const d = {}
          d.doctorId = e.providerid
          d.doctorName = e.firstname + " " + (e.lastname ? e.lastname : "")
          d.specialization = e.specialization && e.specialization != "" ? e.specialization.split(",") : []
          d.degree = e.degree && e.degree != "" ? e.degree.split(",") : []
          d.profileImage = e.profileimage
          d.calendarId = e.calendarid
          d.fees = e.fees && e.fees != "" ? e.fees : 0.0
          d.numVisit = parseInt(generateRandomNumber().toFixed(1));
          d.rating = generateRandomNumber();
          d.isFavorite = e.isfavorite && e.isfavorite > 0 ? true : false
          __arr.push(d)
        })
      }
      const dd = {}
      dd.status = 200
      dd.data = __arr
      //console.log(dd)
      res.send(dd)
    }).catch((error) => {
      const oo = makeErrorObj(700, "Internal Server error")
      res.send(oo)
    })
  } else {
    const oo = makeErrorObj(o.code, "Authentication Failed")
    res.send(oo)
  }
}

const  fetchAppointmentsByConsumerProviderID =(req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  console.log("o.payload.role  ",o.payload.role)

  if (o.code == 200) {
    var providerId=""
    var consumerId=""
    if(o.payload.role == "doctor"){
      providerId=o.payload.id
      consumerId=req.body.consumerId
    }else{
      consumerId = o.payload.id
	  providerId=req.body.providerId
    }
    getAppointmentsByConsumerProviderID(consumerId,providerId,o.payload.role).then(data => {
      const __arr = [];
      if (data && data.length > 0) {
        data.map(e => {
          const d = {}
         

          d.doctorId = e.providerid
          d.consumerId= e.consumerid
          d.namePrifix= o.payload.role=="doctor"?"Mr. ":"Dr. "
          d.appointmentDate = " "+e.appointmentdate
          d.answerData=e.answer
          d.extraInfo = e.extrainfo 
          d.paymentStatus = e.paymentstatus? (e.paymentstatus > 0):false
          d.paidAmount = d.paymentStatus ? e.paidamount : 0
          d.doctorName = e.firstname + " " + (e.lastname ? e.lastname : "")
          d.profileImage = e.profileimage
          d.calendarId = e.calendarid
          d.eventId = e.eventid
          d.appointmentStatus = e.appointmentstatus
          d.conferenceUrl = e.conferenceurl
          d.specialization = e.specialization && e.specialization != "" ? e.specialization.split(",") : []
          d.degree = e.degree && e.degree != "" ? e.degree.split(",") : []
          d.rating = generateRandomNumber();
          d.fees = e.fees && e.fees != "" ? e.fees : 0.0
          d.isFavorite = e.isfavorite && e.isfavorite > 0 ? true : false
          //console.log("d.paymentStatus  ",d.paymentStatus,d.paidAmount )
          __arr.push(d)
        })
      }
      const dd = {}
      dd.status = 200
      dd.data = __arr
      //console.log(dd)
      res.send(dd)
    })
      .catch((error) => {
        //console.log("error.....", error)
        const o = makeErrorObj(700, "Internal Server error")
        res.send(o)
      })
    
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const fetchAppointments = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  console.log("o.payload.role  ",o.payload.role)
  if (o.code == 200) {

    getAppointments(o.payload.id,o.payload.role).then(data => {
      const __arr = [];
      if (data && data.length > 0) {
        data.map(e => {
          const d = {}
         

          d.doctorId = e.providerid
          d.consumerId= e.consumerid
          d.namePrifix= o.payload.role=="doctor"?"Mr. ":"Dr. "
          d.appointmentDate = " "+e.appointmentdate
          d.answerData=e.answer
          d.extraInfo = e.extrainfo 
          d.paymentStatus = e.paymentstatus? (e.paymentstatus > 0):false
          d.paidAmount = d.paymentStatus ? e.paidamount : 0
          d.doctorName = e.firstname + " " + (e.lastname ? e.lastname : "")
          d.profileImage = e.profileimage
          d.calendarId = e.calendarid
          d.eventId = e.eventid
          d.appointmentStatus = e.appointmentstatus
          d.conferenceUrl = e.conferenceurl
          d.specialization = e.specialization && e.specialization != "" ? e.specialization.split(",") : []
          d.degree = e.degree && e.degree != "" ? e.degree.split(",") : []
          d.rating = generateRandomNumber();
          d.fees = e.fees && e.fees != "" ? e.fees : 0.0
          d.isFavorite = e.isfavorite && e.isfavorite > 0 ? true : false
          //console.log("d.paymentStatus  ",d.paymentStatus,d.paidAmount )
          __arr.push(d)
        })
      }
      const dd = {}
      dd.status = 200
      dd.data = __arr
      //console.log(dd)
      res.send(dd)
    })
      .catch((error) => {
        //console.log("error.....", error)
        const o = makeErrorObj(700, "Internal Server error")
        res.send(o)
      })
    
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const saveAnswer = async (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    const{answerData,eventId}=req.body
    updateAnswer(eventId,answerData).then(d=>{
      res.send({ data: {}, status: 200 })
    }).catch(e=>{
      console.log(e)
      res.send({ data: {}, status: 205,msg:"Can't update answer" })
    })
  }else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const getDoctorProfile = async (req, res) => {
  const { providerId } = req.body
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    const data = await fetchDoctorProfile(o.payload.id, providerId).catch((error) => { console.log("error.....", error); const o = makeErrorObj(700, "Internal Server error"); res.send(o) })
    if (data && data.length > 0) {
      const e = data[0];
      const d = {}
      const calendarid = e.gmail
     // console.log("calendarid  ", calendarid)
      //const times = generateTimeSlot(20, 30, moment().format("YYYY-MM-DD"))
      d.doctorId = e.id
      d.doctorName = e.firstname + " " + (e.lastname ? e.lastname : "")
      d.profileImage = e.profileimage
      d.experience = e.experience
      d.calendarId = e.gmail
      d.gmail = e.gmail
      d.numReview = parseInt(generateRandomNumber(30, 300).toFixed(1))
      d.whatsappNo = e.whatsappno && e.whatsappno != "" ? e.whatsappno : ""
      d.videoCallUrl = e.videocallurl && e.videocallurl != "" ? e.videocallurl : ""
      d.extraInfo = e.extrainfo && e.extrainfo != "" ? e.extrainfo : ""
      d.specialization = e.specialization && e.specialization != "" ? e.specialization.split(",") : []
      d.rating = generateRandomNumber();
      d.degree = e.degree && e.degree != "" ? e.degree.split(",") : []
      d.fees = e.fees && e.fees != "" ? e.fees : 0.0

      d.isFavorite = e.isfavorite && e.isfavorite > 0 ? true : false
      const dt = moment().format('DD-MM-YYYY')
      const dt2 = moment().format('YYYY-MM-DD')
      fetchSlot(calendarid, dt2).then(async calData => {
        const times = await generateTimeSlot(d.doctorId, 30, dt2, calData)
        d.slots = { "date": moment().format('ll'), "slots": times }
        res.send({ data: d, status: 200 })
      }).catch((error) => { console.log("error.....", error); const o = makeErrorObj(700, "Internal Server error"); res.send(o) })


    } else {
      const o = makeErrorObj(700, "Internal Server error")
      res.send(o)
    }

    //}

  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }

}
const bookAppointment = async (req, res) => {
  const { providerId, appointmentDateTime } = req.body
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code != 200) { res.send(makeErrorObj(o.code, "Authentication Failed")); return; }
  const gmails = await fetchGmailById([providerId])
  const inviteData = await sendInvite(gmails, moment(appointmentDateTime, "YYYY-MM-DD HH:mm:ss"), o.payload.id, providerId)
  //console.log("inviteData",inviteData)
  if (inviteData.status != 200) { res.send(makeErrorObj(601, "Can't send invite")); return; }
  makeAppointment(o.payload.id, providerId, appointmentDateTime, inviteData.data.id).then(data => { data.insertId && data.insertId > 0 ? res.send({ status: 200 }) : res.send(makeErrorObj(602, "error on update record")) })
    .catch((error) => { res.send(makeErrorObj(603, "error on update database")) })
}
const addRemoveFavorite = (req, res) => {
  const { providerId } = req.body
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {

    updateFavorite(o.payload.id, providerId).then(data => {
      if (data.insertId && data.insertId > 0) {
        res.send({ status: 200 })
      } else {
        const o = makeErrorObj(700, "Internal Server error")
        res.send(o)
      }

    }
    ).catch((error) => {
      //console.log("error.....", error)
      const o = makeErrorObj(700, "Internal Server error")
      res.send(o)
    })
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }

}
const permissionsAction = async (action, options) => {
  return new Promise(function (resolve, reject) {
    drive.permissions[action](options, (err, response) => {
      if (err) {
        resolve({ status: 201, msg: "error", data: err })
      } else {
        const data = response.data
        data.status = 200;
        resolve(data)
      }
    })
  })
}
const driveAction = async (action, options) => {
  return new Promise(function (resolve, reject) {
    drive.files[action](options, (err, response) => {
      if (err) {
        resolve({ status: 201, msg: "error", data: err })
      } else {
        const data = response.data
        data.status = 200;
        resolve(data)
      }
    })
  })
}
const uploadFile = async (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code != 200) {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
    return;
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(200).send({ status: 501, msg: "file not provided" });
    return;
  }
  //console.log("eventId", req.body.eventId)
  let bufferStream = new stream.PassThrough();
  bufferStream.end(req.files.file.data);
  const options = { auth: jwtClient, media: { mimeType: req.files.file.mimetype, body: bufferStream, }, 'requestBody': { 'name': req.files.file.name, mimeType: req.files.file.mimetype, starred: true }, fields: 'id', }
  const drvdata = await driveAction("create", options)
  if (drvdata.status != 200) {
    console.log("err", drvdata.data)
    res.status(200).send({ status: 502, msg: "can't upload to drive" })
  }
  const fileName = req.files.file.name
  const fileid = drvdata.id;
  const prmOpt = { auth: jwtClient, fileId: fileid, requestBody: { type: 'anyone', role: 'reader', }, fields: 'id', }
  const paramData = await permissionsAction("create", prmOpt)
  if (paramData.status != 200) {
    console.log("err", paramData.data)
    res.status(200).send({ status: 503, msg: "can't share file" })
  }
  var providerGmail = null;
  const eventData = await getIdByEventId(req.body.eventId)
  if (eventData && eventData.length > 0) {
    const mailData = await fetchGmailById([eventData[0].providerid])
    if (mailData && mailData.length > 0) {
      providerGmail = mailData[0].gmail
    }
  }
  if (!providerGmail) {
    res.status(200).send({ status: 504, msg: "provider email not available" })
  }
  const attachments = await attachmentsByEventId(req.body.eventId).catch(err => {
    res.status(200).send({ status: 505, msg: "error on fetching other attachment" })
    return
  })
  const n ={"attachmentid": fileid, "mimetype": req.files.file.mimetype, "owner": o.payload.id, "title": req.files.file.name}
  const allAttachments =attachments && attachments.length > 0 ? [].concat(attachments):[]
  allAttachments.push(n)
  //console.log("attachments", attachments)

  const attachRes = allAttachments && allAttachments.length > 0 ? allAttachments.map(d => {
    return { 'fileUrl': `https://drive.google.com/file/d/${d.attachmentid}/view?usp=sharing`, "title": d.title }
  }) : []
  //attachRes.push({ 'fileUrl': `https://drive.google.com/file/d/${fileid}/view?usp=sharing`, "title": fileName })
  const attach = { auth: jwtClient, 'calendarId': providerGmail, 'eventId': req.body.eventId, supportsAttachments: true, 'resource': { "attachments": attachRes } }
  const patchData = await eventAction("patch", attach)
  if (patchData.status != 200) {
    console.log("patchData err", patchData.data)
    res.status(200).send({ status: 506, msg: "can't send file to provider" })
    return
  }
  insertAttachment(req.body.eventId, fileid, req.files.file.mimetype, req.files.file.name, o.payload.id).then(dta => {
    if (dta.insertId && dta.insertId > 0) {
      res.status(200).send({ status: 200, msg: "file Uploaded", data:allAttachments})
    } else {
      res.status(200).send({ status: 507, msg: "Can't update record" })
    }
  }).catch(e => {
    res.status(200).send({ status: 508, msg: "there was a problem to update record" })
  })
}
const getavailableslots = async (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    const { providerId, calendarId, date } = req.body
    const n = parseInt(generateRandomNumber(20, 10).toFixed(1))
    //console.log("calendarId  ", calendarId)
    const dt = moment(date, "DD-MM-YYYY").format('YYYY-MM-DD')
    const data = await fetchSlot(calendarId, dt)
    const times = await generateTimeSlot(providerId, 30, dt, data)
    //
    const d = {}
    d.status = 200
    d.data = {}
    d.data.doctorId = providerId
    d.data.slots = { "date": moment(date, "DD-MM-YYYY").format('ll'), "slots": times }
    //jwt.refresh(true)
    res.send(d)
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const logout = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    jwt.refresh(true)
    res.send({ status: 200 })
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const refresh = (req, res) => {
  const o = varifyToken(req.headers.sessiontoken)
  if (o.code == 200) {
    const sessiontoken = generateToken({ username: o.username, id: o.id });
    res.send({ sessiontoken })
  } else {
    const o = makeErrorObj(o.code, "Authentication Failed")
    res.send(o)
  }
}
const fetchSlot = async (calendarId, date) => {

  return new Promise(function (resolve, reject) {

    calendar.events.list({
      auth: jwtClient,
      calendarId: calendarId,
      timeMin: date + "T00:00:00+05:30",
      timeMax: date + "T23:59:59+05:30",
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, response) => {
      console.log(err)
      //console.log(response.data)
      err ? reject({ msg: "No data available", code: 202 }) : resolve(response.data)
      //return response.data
    });
  })

}
const listEvents = (req, res, next) => {

  calendar.events.list({
    auth: jwtClient,
    calendarId: "paitest.debasis@gmail.com",
    timeMin: "2020-09-09T18:30:00.000Z",
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, response) => {
    //console.log(response.data)
    if (err) return res.status(200).json(err)
    return res.status(200).json(response.data)
  });


}
const createCalender = async (req, res) => {
  const r = await calendar.calendarList.list({ auth: jwtClient, minAccessRole: "freeBusyReader" })
  /*const r = await calendar.calendars.insert({
    auth: jwtClient,
    requestBody: {
      summary: "Calendar To Test", // required
      timezone: "Europe/Zurich", // optional
      description: "for test Calendar" // optional
    }
  }
  )*/
  //console.log(r)
  return res.status(200).json(r)
}
const eventAction = async (action, option) => {
  return new Promise(function (resolve, reject) {
    calendar.events[action](option, (err, response) => {
      if (err) {
        resolve({ status: 201, msg: "error", data: err })
      } else {
        const data = response.data
        data.status = 200;
        resolve(data)
      }
    })
  })
}
const updateInvite = async (eventId, status, urls) => {
  //sarry[0]=="Accepted" || sarry[0]=="Tentatively Accepted" || sarry[0]=="Updated invitation" || sarry[0]=="Declined"
  if (status == "Accepted") {
    getIdByEventId(eventId).then(dta => {

      const data = dta[0]
      //console.log(data)
      if (data.length <= 0) {
        return
      }
      fetchGmailById([data.providerid, data.consumerid]).then(async data1 => {
        const organizer = { email: 'kausik@poondit.com', self: false }
        const attndee = data1.map(d => { if (d.id == data.providerid) organizer.email = d.gmail; return { 'email': d.gmail, "displayName": d.firstname + " " + d.lastname } })


        attndee.push({ 'email': 'kausik@poondit.com', "displayName": "App Admin" })
        //console.log(JSON.stringify(attndee))
        const o = { 'attendees': attndee };
        const options = { auth: jwtClient, 'calendarId': 'primary', 'eventId': eventId, 'resource': o, sendNotifications: true, conferenceDataVersion: 1, sendUpdates: "all" }
        const evtData = await eventAction("patch", options)
        if (evtData.status != 200) {
          console.log("err  ", evtData.data)
          return
        }
        const option2 = { auth: jwtClient, "calendarId": "kausik@poondit.com", "eventId": eventId, "destination": organizer.email, "sendNotifications": true, "sendUpdates": "all" }
        const evtData2 = await eventAction("move", option2)
        if (evtData2.status != 200) {
          console.log("err  ", evtData2.data)
          return
        }
        updateAppointMentStatus(eventId, "confirm");
        //console.log("response1  ", evtData2)

      })
    }
    ).catch((error) => {
      console.log("error.....", error)
    })
  } else if (status == "Declined") {
    updateAppointMentStatus(eventId, "cancelled");
  } else if (status == "Updated invitation") {
    updateAppointMentStatus(eventId, "confirm", urls);

  }
}

const sendInvite = async (emails, dateTime, userId, providerId) => {

  const attndee = emails.map(d => { return { 'email': d.gmail, "displayName": d.firstname + " " + d.lastname } })
  inviteOption.auth = jwtClient
  inviteOption.resource.start.dateTime = dateTime.format("YYYY-MM-DDTHH:mm:ss") + "+05:30"
  inviteOption.resource.end.dateTime = dateTime.add(30, "minutes").format("YYYY-MM-DDTHH:mm:ss") + "+05:30"
  inviteOption.resource.attendees = attndee
  return new Promise(function (resolve, reject) {
    calendar.events.insert(inviteOption, (err, response) => {
      resolve({ status: err ? 201 : 200, data: err ? err : response.data, msg: err ? "No data available" : "" })
    })
  })
}
const getEvent = (req, res, next) => {
  calendar.events.get({ auth: jwtClient, "calendarId": 'paitest.debasis@gmail.com', "eventId": "mq8l7tt7ag230l5aqv2opikms4" }, (err, response) => {
    if (err) {
      //console.log("err  ", err)
      return res.status(200).json(err)
    }
    return res.status(200).json(response.data)
  });
}
const generateUID = () => {
  var count = 10;
  var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var str = '';

  for (var i = 0; i < count; i++) {
    str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  return str
}
const moveEvent = (req, res, next) => {
  calendar.events.move({
    auth: jwtClient,
    "calendarId": "kausik@poondit.com",
    "eventId": "8408vc52doe31fes8gbccihda8",
    "destination": "aserviceapp1@gmail.com",
    "sendNotifications": true,

    "sendUpdates": "all",
  }, (err, response) => {
    if (err) {
      //console.log("err  ", err)
      return res.status(200).json(err)
    }
    return res.status(200).json(response.data)
  })
}
const listGoogleDrive = (req, res, next) => {
  drive.files.list({
    auth: jwtClient,
    pageSize: 10,
    fields: '*',
  }, (err, response) => {

    if (err) {
      //console.log("err  ", err)
      return res.status(200).json(err)
    }
    return res.status(200).json(response.data)

  });
}
const shareDriveFile = (req, res, next) => {
  const permissions = {
    type: 'anyone',
    role: 'reader',

  };
  drive.permissions.create({
    auth: jwtClient,
    fileId: '1Scp-atXeHBqcV6AeR3xwFiYQ47i4Y5WU',
    requestBody: permissions,
    fields: 'id,webViewLink',
  }, (err, response) => {

    if (err) {
      //console.log("err  ", err)
      return res.status(200).json(err)
    }
    return res.status(200).json(response.data)

  });
}
const insert = (req, res, next) => {

  //eventPatch.conferenceData.createRequest.requestId = generateUID()
  calendar.events.insert({
    auth: jwtClient,
    calendarId: 'primary',
    resource: {
      'summary': 'test meeting req',
      'location': 'Not Applicable',
      'description': 'Meeting Request',
      'start': {
        'dateTime': '2020-10-16T09:00:00+05:30',
        'timeZone': 'Asia/Kolkata',
      },
      'end': {
        'dateTime': '2020-10-16T09:30:00+05:30',
        'timeZone': 'Asia/Kolkata',
      },
      "guestsCanModify": true,
      "extendedProperties": {
        "shared": {
          "petsAllowed": "yes"
        }
      },


      "sendNotifications": true,
    
      "conferenceDataVersion": 1,
      "sendUpdates": "all",
      'recurrence': [],
      "attachments": [{'fileUrl': 'https://drive.google.com/open?id=1vLiUNyrr9eyokX7AsSNWEZtmVd4915VC',"title": "TEACHER INFORMATION.pdf",},
          {'fileUrl': 'https://drive.google.com/open?id=13QxfCm-T4fghWr7o8hQM83N8p0VRcfqV',"title": "invite.ics", }],
      'attendees': [
        { 'email': 'paitest.debasis@gmail.com' },
        { 'email': "aserviceapp1@gmail.com", "organizer": true },
        { 'email': "kausik@poondit.com" }

      ],
      "reminders": {
        "useDefault": false,
        "overrides": [
          { "method": 'email', "minutes": 40320 },
          { "method": 'popup', "minutes": 10 }
        ]
      },
    },
    sendNotifications: true,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    supportsAttachments: true
  }, (err, response) => {
    if (err) {
      //console.log("err  ", err)
      return res.status(200).json(err)
    }
    return res.status(200).json(response.data)
    /*eventPatch.conferenceData.createRequest.requestId = generateUID()
    calendar.events.patch({
      auth: jwtClient,
      'calendarId': 'primary',
      'eventId': response.data.id,
      'resource': eventPatch,
      sendNotifications: true,
  conferenceDataVersion: 1,
  sendUpdates: "all"
  },(err1, response1) => {

    if (err1) {
      //console.log("err  ", err)
      return res.status(200).json(err1)
    }
    return res.status(200).json(response1.data)
  });*/

  })
}
module.exports = {
  signIn,
  refresh,
  fetchAppointments,
  fetchFavorites,
  addRemoveFavorite,
  getDoctorProfile,
  bookAppointment,
  logout,
  searchProviders,
  getavailableslots,
  welcome,
  listEvents,
  insert,
  createCalender,
  sendInvite,
  getEvent,
  updateInvite,
  moveEvent,
  listGoogleDrive,
  shareDriveFile,
  uploadFile,
  getAllAttachment,
  saveAnswer,
  updatePayments,
  fetchAppointmentsByConsumerProviderID

}
