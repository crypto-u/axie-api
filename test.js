
var timestamp = 1209600
var date = new Date(timestamp*1000);

var date1 = new Date();

const hello = JSON.stringify(date)
const gogo = hello.substring(1,11).replace("1970", "2022").replace("-", "/").replace("-", "/");
console.log(gogo);
const hello2 = JSON.stringify(date1);
const gogo8 = hello2.substring(1,11).replace("-", "/").replace("-", "/");
console.log(gogo8);

var date5 = new Date(gogo);
var date6 = new Date(gogo8);
  
var Difference_In_Time = date5.getTime() - date6.getTime();
  
var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

console.log(Difference_In_Days);