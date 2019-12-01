let axios = require("axios");


// for c
const testc = async i => {
  const params = {
    code: `#include<stdio.h>

int main()
{
printf("hello this is c");
return 0;
}`,
    input: "",
    timeStamp: i,
    timeout: 100,
    language: "c"
  };
  axios
    .post("http://localhost:5000/test", { params })
    .then(data => console.log(data.data));
};

//infinite loop
const test = async i => {
  const params = {
    code: `#include<iostream>
          using namespace std;
          
          int main() {
            cout << "Hello World";
            return 0;
          }`,
    input: ''
  })
  .then((result) => {
    console.log(result.data);
  });
}


(async () => {
  await test();
})();

