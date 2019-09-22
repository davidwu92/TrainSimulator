//Clock in header
{function startTime() { 
  let today = new Date();
  let date = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =
  `${month}/${date}/${year} ${h + ":" + m + ":" + s}`;
  let t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
startTime()}

//getting firebase online
const firebaseConfig = {
  apiKey: "AIzaSyDxa85HqsmtpHbJ-eHnZfdph3aW6AaB7q8",
  authDomain: "trainsimulator-7c11c.firebaseapp.com",
  databaseURL: "https://trainsimulator-7c11c.firebaseio.com",
  projectId: "trainsimulator-7c11c",
  storageBucket: "",
  messagingSenderId: "576053015863",
  appId: "1:576053015863:web:75286b112e13a7409f96b2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore() 

//Created 4 sample trains
db.collection('Trains').doc(`Gotham Monorail`).set({
  name : `Gotham Monorail`,
  destination : `Gotham` ,
  firstTime : `01:00`,
  frequency : `10`,
})
db.collection('Trains').doc(`Supertrain`).set({
  name : `Supertrain`,
  destination : `Metropolis` ,
  firstTime : `02:05`,
  frequency : `20`,
})
db.collection('Trains').doc(`Jump City Express`).set({
  name : `Jump City Express`,
  destination : `Jump City` ,
  firstTime : `03:10`,
  frequency : `30`,
})
db.collection('Trains').doc(`Keystone Subway`).set({
  name : `Keystone Subway`,
  destination : `Keystone City` ,
  firstTime : `02:53`,
  frequency : `47`,
})

//Global variables I might need
let trainNames = []
let destinations = []
let frequencies = []
let nextArrivals = []
let minutesAway = []
let trainCount = 0 //global variable to keep count of # of trains

//CONSOLE LOGGING each document's object
db.collection('Trains').get()
.then(({docs})=> {
  docs.forEach(train=>{
    console.log(train.data())
  })
})

// ON SNAPSHOT, these are created
db.collection('Trains').onSnapshot(({docs}) => {
  document.getElementById('trainTable').innerHTML = (``) //clear out the table data first
    docs.forEach(function traininfo(train, i){
      trainCount++ //add one to trainCount
      trainNames[i] = train.data().name;
      destinations[i] = train.data().destination;
      frequencies[i] = train.data().frequency;  

      //first departure of the day Calculations
      let firstTime = train.data().firstTime.split(":"); //makes array of 1st departure in [HR, MIN]
        firstTime[0] = parseInt(firstTime[0])
        firstTime[1] = parseInt(firstTime[1])
      let firstTimeInMin = firstTime[0]*60 + firstTime[1]; //1st departure in min after midnight
      console.log('first departure in min past midnight:' + firstTimeInMin)
      console.log (`Train arrives every ${parseInt(frequencies[i])} min`)

      //Minutes til next train:
      let today = new Date();
      let currentTimeinMin = today.getHours()*60 + today.getMinutes(); //current time in min past midnight
      console.log('current time in min past midnight:'+ currentTimeinMin);
      if (currentTimeinMin > firstTimeInMin) {
        minutesAway[i] = parseInt(frequencies[i])- ((currentTimeinMin - firstTimeInMin)%parseInt(frequencies[i]));
        console.log('Min til next train:' + minutesAway[i]);
      } else if (currentTimeinMin < firstTimeInMin){
        minutesAway[i] = parseInt(frequencies[i]) - ((currentTimeinMin + 1440 - firstTimeInMin)%parseInt(frequencies[i]));
        console.log('Min til next train:' + minutesAway[i]);
      } else {
        minutesAway[i] = 0;
        console.log('Min til next train:' + minutesAway[i]);
      }
    
      //Next Train's Arrival Time:
      let nextArrivalTime = currentTimeinMin + minutesAway[i];
      let arrivalHour = Math.floor(nextArrivalTime/60);
      let arrivalMin = nextArrivalTime%60;
      if (arrivalMin <10) {arrivalMin = "0" + arrivalMin} //under 10 min needs a zero
      nextArrivals[i] = arrivalHour + `:` + arrivalMin;
      
      //Adding rows to table
      let newrow = document.getElementById('trainTable').insertRow(i)

      let nameCell = newrow.insertCell(0);
      let destinationCell = newrow.insertCell(1);
      let freqCell = newrow.insertCell(2);
        nameCell.innerHTML = (`${trainNames[i]}`);
        destinationCell.innerHTML = (`${destinations[i]}`);
        freqCell.innerHTML = (`${frequencies[i]}`);

      //next- and minway- Cells need to somehow update each minute? 
      let nextCell = newrow.insertCell(3);
      let minawayCell = newrow.insertCell(4);
        nextCell.innerHTML = (`${nextArrivals[i]}`)
        nextCell.setAttribute(`id`, `nextCell${i}`) //gave each "next" cell an ID
        minawayCell.innerHTML = (`${minutesAway[i]}`)
        nextCell.setAttribute(`id`, `minawayCell${i}`)
    })
})

//Event Listener for the form
document.getElementById(`submitform`).addEventListener('click', e=>{
  e.preventDefault()
  //check that form is filled out
  if (document.getElementById(`newName`).value && document.getElementById(`newDestination`).value &&
     document.getElementById(`newFirstTime`).value && document.getElementById(`newFrequency`).value) {
      //add to collection Trains in db
      db.collection('Trains').doc(`${document.getElementById(`newName`).value}`).set({
        name : `${document.getElementById(`newName`).value}`,
        destination : `${document.getElementById(`newDestination`).value}` ,
        firstTime : `${document.getElementById(`newFirstTime`).value}`,
        frequency : `${document.getElementById(`newFrequency`).value}`,
      })
  } else {
    M.toast({html: 'Please fill out the entire form before hitting "submit".'})
  }
})