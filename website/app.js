/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip='
const apiKey = "&appid=aeff4fbfc0f7f40c18d3ff4ef57e991b";


document.getElementById('generate').addEventListener('click', performAction);

// Create a new date instance dynamically with JS
let d = new Date();

let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();



  
// callback function
function performAction(){
 
  const zipEntery =  document.getElementById('zip').value;
  const content = document.getElementById('feelings').value;
  if(zipEntery !== "" && content !== ""){
     retrieveData(baseUrl,zipEntery,apiKey)

    .then(function(data){
        console.log(data);
      // Add data to the post
      
      postData('/add', {date:newDate, temp:converToCelsius( data.main.temp), content:content} );
    }).then(function(){
      updateUI()
    }).catch(function(error) {
      console.log(error);
      alert('The zip code is invalid. Try again');

  });
   }else{
     alert("please fill out the empty fields");
   }
  
 }


// Async function  to  POST data form client side to server side. 
const postData = async ( url = '', data = {})=>{

  const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify(data)         
});

  try {
    const postedData = await response.json();
    return postedData;
  }catch(error) {
  console.log("error", error);
  }
}

//sign up async function to make app getting(fetch) data from the server(or app endpoint)
const retrieveData = async (baseUrl,zipEntery,apiKey) =>{ 
  const response = await fetch(baseUrl+zipEntery+apiKey);
  try {
  // Transform into JSON
  const data = await response.json();
  return data;
  }
  catch(error) {
    console.log("error", error);
    // appropriately handle the error
  }
}


/*update UI*/ //to retrieve that app’s data on the client side
const updateUI = async ()=>{
    const request = await fetch('/all')

    try {
        const data = await request.json()
        console.log(data);
        let date =  data.date;
        let temp =  data.temp; 
        let content =  data.content; 

        //to change the content
        document.getElementById('entry').innerHTML = 'Most Recent Entry';
        document.getElementById('dateTitle').innerHTML = 'The Date is';
        document.getElementById('tempTitle').innerHTML = 'The Temperature is';
        document.getElementById('contentTitle').innerHTML = 'The Content is';

        document.getElementById("date").innerHTML = date;
        document.getElementById("temp").innerHTML = temp;
        document.getElementById("content").innerHTML = content;
        setTimeout(() => {
          alert(`You can see this data below : \n Date: \n ${date}
          \n Temperature: \n
          ${temp}
          \n Your feeling: \n
          ${content}
          `)
        }, 2000)

    }catch(error){
        console.log("error",error)
    }
}
// this arrow function for Converting temperature unit from kelvin to celsius
const converToCelsius = kelvin => {
  const celsius = Math.floor(kelvin - 273)
  return `${celsius}°C` 
}