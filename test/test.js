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

int main() 
{
  int a,b;
  cin>>a>>b;
   // while(1) {}
    cout<<a<<" "<<b;
    return 0;
}`,
    input: "10 10",
    timeStamp: i,
    timeout: 50,
    language: "c++"
  };
  axios
    .post("http://localhost:5000/compile", { params })
    .then(data => console.log(data.data));
};

// const test = async i => {
//   const params = {
//     code: `#include<iostream>
// using namespace std;

// int main() 
// {
//   int a,b;
//   cin>>a>>b;
//     cout<<a<<" "<<b;
//     return 0;
// }`,
//     input: "",
//     timeStamp: i,
//     timeout: 100,
//     language: "c++"
//   };
//   axios
//     .post("http://localhost:5000/test", { params })
//     .then(data => console.log(data.data));
// };

let i = 0;

(async () => {
  for (i = 0; i < 100; i++) await test(i + 1);
})();
