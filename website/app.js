/* Global Variables */
let errorElemnt  ;
let errorChilds= [];
// Personal API Key for OpenWeatherMap API
const apiKey = "0769066e2899e34bdf4e76fe07183523";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// Make url
const makeURLUsingZip = (zip, apiKey) => {
  return BASE_URL + zip + ",us&appid=" + apiKey;
};

// get temperature from wheather wep app api 
const getTemperatureFromApi = async (zip) => {
  const res = await fetch(makeURLUsingZip(zip, apiKey));

  if (res.status != 404) {
    const data = await res.json();
    return data.main.temp;
  } else {
    const serverRespond = await res.json()
    console.log("there was error equred ", serverRespond.message);
    AddErrorIdecator("zip","this is the wrong zip code");
  }
};

// This code is taken from udacity class code in lesson3 chapter 6.
// as there is no more I can add to it, It is perfect to do the job here.
const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};


// This function fill and show the response Entry
const fillEntry = () => {
  fetch("/data").then(async (response1) => {
    data = await response1.json();

    const { temp, date, feelings } = data;
    document.getElementById("date").innerText = date;
    document.getElementById("temp").innerText = temp;
    document.getElementById("content").innerText = feelings
      ? feelings
      : "No response found";
  });

  ShowEntryArea();
};

// This function is to hide the entry area until the respone get back

const ShowEntryArea = ()=>{
    document.getElementsByClassName("hide")[0].classList.replace("hide","display");
}

// this function is to add error element 

const AddErrorIdecator = (elementId,errorMassage)=>{
    errorElemnt = document.getElementById(elementId);
    errorElemnt.classList.add("error");
    const error = document.createElement("p");
    errorChilds.push(error);
    error.textContent = errorMassage;
    error.classList.add("error-text");
    error.classList.add = "error-child";
    errorElemnt.parentElement.appendChild(error);
}

// this function remove any error indecators from UI
const resetErrorsIndecators = ()=>{
    if(errorElemnt){
    errorElemnt.classList.remove("error");
    for(error of errorChilds){
        error.remove();
    }
    }
}

// event listener 
document.getElementById("generate").addEventListener("click", async() => {
    resetErrorsIndecators();
  const zipInput = document.getElementById("zip").value;
  if (!zipInput) {
      AddErrorIdecator("zip","This cannot left empty");
  } else {
    const temp = await getTemperatureFromApi(zipInput);
    if(temp){
        const feelings = document.getElementById("feelings").value;
        const data = { temp: temp, date: newDate, feelings: feelings };
        postData("/", data);
        fillEntry();}
    else{
        console.log("There is no data to display");
    }
  }
});
