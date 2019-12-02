let axios = require("axios");




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

