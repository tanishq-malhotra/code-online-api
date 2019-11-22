import { spawn, exec } from "child_process";
import path from "path";

export const compile = async file => {
  let out = "";
  let p = path.join(__dirname, file);
  let compile = spawn("g++", [p]);
  compile.stderr.on("data", data => {
    out += String(data) + "/n";
  });
  compile.on("close", async data => {
    if (data === 0) {
      let run = spawn("./a.exe", []);
      run.stdout.on("data", async output => {
        // console.log(String(output));
        // return String(output);
        out += String(output);
      });
    }
  });
  console.log(out);
};
