var MailListener = require("mail-listener2");
const {updateInvite } = require('./handlers')
var mailListener = new MailListener({
  // username: "kausik@poondit.com",
  // password: "cobtfonxcwejnuge",
  username: "kausik@poondit.com",
  // password: "rvtbilprvgcrcjvm",
  password: "uozzslkoiwnwzjdb",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  markSeen: true,
  fetchUnreadOnStart: true,
  attachments: false,
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments
 
  var sarry =mail.subject.split(":")
  if(sarry && sarry.length > 0 && (sarry[0]=="Accepted" || sarry[0]=="Tentatively Accepted" || sarry[0]=="Updated invitation" || sarry[0]=="Declined")){
    //console.log(mail.html)
    var m =mail.html.match(/<\s*meta\s+itemprop\s*\=\s*\"eventId\/googleCalendar\"\s+content\s*\=\s*\"[^"]+\"[^>]+>/ig)
    var eid = m[0].split(/content\s*\=\s*\"/ig)[1].split('"')[0]
    if(sarry[0]=="Updated invitation"){
      var urls=[]
      var m2 =mail.html.match(/<a([^>]+)>(.+?)<\/a>/ig)
      if(m2 && m2.length > 0){
       var matchUrl = m2.map(d=>{
       if(d.indexOf('target="_blank"') == -1){
         return ""
       }
       var a = d.split(/<a[^>]+>/ig)
      
      if(a && a.length >1){
        var str=a[1]
        //console.log(str)
        if(str.indexOf('https:') == -1 && str.indexOf('http:') == -1 && str.indexOf('meet.google.com/') == -1){
          return ""
        }
        if(a[1].indexOf('meet.google.com/') > -1){
         return "https://"+a[1].split(/<\/a>/ig).join("")
        }else{
          return a[1].split(/<\/a>/ig).join("")
        }
        
      }
      return ""
      })
      var matchUrl2 = matchUrl.filter(d=>{return d != ""})
      urls = urls.concat(matchUrl2)
      }
     
      
      
    }
   // console.log("emailParsed urls", urls);
   // console.log("emailParsed eid", eid);
    updateInvite(eid,sarry[0],urls);
   
  }
  //console.log("emailParsed subject", mail.subject);
  // mail processing code goes here
});

mailListener.on("attachment", function(attachment){
  //console.log(attachment.path);
});