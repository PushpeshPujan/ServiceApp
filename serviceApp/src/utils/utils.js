
//export const BASE_URL = "http://192.168.1.106:3000/"
export const BASE_URL = "http://192.168.43.93:3000/"
//export const BASE_URL="http://richasundrani.com:3000/"
import RazorpayCheckout from 'react-native-razorpay';
async function doFetch(url, options, __showLoading = true) {
 // console.log("doctorDetails  calling doFetch URL  ", JSON.stringify(url));
 // console.log("doctorDetails  calling doFetch options ", JSON.stringify(options));
  try {
    global.showHideLoading(__showLoading, false, 20000)
    let response = await fetch(url, options);
    let responseJson = await response.json();
    options.timeout = 10000
    global.showHideLoading(false, true)
   // console.log("doctorDetails  calling doFetch responseJson ", JSON.stringify(responseJson));
    return responseJson;
  } catch (error) {
    console.log("doctorDetails  doFetch responseJson erreo", JSON.stringify(error));
    global.showHideLoading(false, true)
    return error
  }
}

export async function onPay(due,eventid,onComplete){
  //this.props.navigation.openDrawer();
  console.log("  onPay   ",due.toFixed(2))
  var options = {
      description: 'Credits towards consultation',
     // image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag', // Your api key
      amount: due.toFixed(2).split(".").join(""),
      name: global.userData.displayName,
      prefill: {
        email: global.userData.gmail,
        contact: global.userData.phone,
        name: global.userData.displayName
      },
      theme: {color: '#e6e6e7'}
    }
    return new Promise(function (resolve, reject) {
    RazorpayCheckout.open(options).then(async(data) => {
      // handle success
      data.paymentStatus=1
      data.eventId=eventid
      data.amount=due
      const r = await asyncPost(BASE_URL+"updatepayments",data)
      if(r.status == 200){
        if(onComplete){
          onComplete()
        }
          alert("Your transaction completed")
          resolve(true) ;
      }else{
          alert("Can't complete your transaction") 
          resolve( false);
      }
      //alert(`Success: ${data.razorpay_payment_id}`);
    }).catch(async(error) => {
      // handle failure
      error.paymentStatus=-1
      error.eventId=eventid
      error.amount=due
      const r = await asyncPost(BASE_URL+"updatepayments",error)
      alert("Can't complete your transaction") 
      resolve(false) ;
      //alert(`Error: ${error.code} | ${error.description}`);
    });
    })
}
export async function uploadFile(image, others, __showLoading = true) {
  const data = new FormData();
  if (others) {
    for (var prop in others) {
      data.append(prop, others[prop]);
    }
  }
  data.append('file', image);
  const options = {method: 'post', body: data,headers: {'Content-Type': 'multipart/form-data;', sessiontoken: global.sessiontoken,},}
  const res = await doFetch(BASE_URL + "upload", options, __showLoading);
  return res
}
export async function asyncGet(url, __showLoading = true) {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      sessiontoken: global.sessiontoken,
    },
    method: 'GET'
  }
  const res = await doFetch(url, options, __showLoading);
  return res;
}

export async function asyncPost(url, body, isJson = true, ContentType = "", __showLoading = true) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      sessiontoken: global.sessiontoken,
      'Content-Type': ContentType == "" ? 'application/json' : ContentType,
    },
    body: isJson ? JSON.stringify(body) : body,
  };

  const res = await doFetch(url, options, __showLoading);
  return res;
}

