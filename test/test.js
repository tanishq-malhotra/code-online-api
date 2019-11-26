var axios = require('axios');

function sendRequest(i) {
    axios.post('http://localhost:5000/compile-cpp', {
        code: `#include<iostream>
               using namespace std;
               
               int main() {
                   cout<<"Hello World";
                   return 0;
               }`,
        input:'',
        timeStamp: i
    })
    .then((response) => {
        console.log(response.data);
    })
}

let i = 0; 
setInterval(() => {sendRequest(i++);},100);