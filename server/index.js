const express = require('express')
const bodyParser = require('body-parser')
const port= process.env.PORT || 3000;
const google = require("./google")
const mailHandler = require("./mailHandler")
const fileUpload = require('express-fileupload');
const { signIn,listEvents,createCalender,sendInvite,fetchAppointmentsByConsumerProviderID,updatePayments,uploadFile,shareDriveFile,getEvent,saveAnswer,getAllAttachment,listGoogleDrive,insert,moveEvent,fetchAppointments,fetchFavorites,addRemoveFavorite,getDoctorProfile,bookAppointment,logout,searchProviders,welcome ,getavailableslots} = require('./handlers')

const app = express()
app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static('data'));
//app.get('/', welcome)
app.post('/signin', signIn)
app.post('/getappointments', fetchAppointments)
app.post('/getfavorites', fetchFavorites)
app.post('/addremovefavorite', addRemoveFavorite)
app.post('/getdoctorprofile', getDoctorProfile)
app.post('/bookappointment', bookAppointment)
app.post('/searchproviders', searchProviders)
app.post('/getavailableslots', getavailableslots)
app.get('/listevents', listEvents)
app.post('/logout', logout)
app.get('/createCalender', createCalender)
app.get('/insert', insert)
app.post('/sendinvite', sendInvite)
app.get('/getEvent', getEvent)
app.get('/moveEvent', moveEvent)
app.get('/listGoogleDrive', listGoogleDrive)
app.get('/shareDriveFile', shareDriveFile)
app.post('/upload', uploadFile)
app.post('/getattachment', getAllAttachment)
app.post('/saveanswer', saveAnswer)
app.post('/updatepayments', updatePayments)
app.post('/appointmentsByConsumerProviderID', fetchAppointmentsByConsumerProviderID)


app.listen(`${port}`, () => {console.log(`Server now listening at localhost:${port}`);});