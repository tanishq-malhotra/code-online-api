let axios = require("axios");

async function test() {
  return axios.post(`http://localhost:5000/compile`, {
    language: 'C++',
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