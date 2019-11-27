import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export const compileCpp = router => {
  router.post("/compile-cpp", async (req, res) => {
    const code = req.body.params.code;
    const input = req.body.params.input.split("\n");
    const timeStamp = req.body.params.timeStamp;
    const p = path.join(__dirname, "../../../files/" + timeStamp + ".cpp");
    const filePath = path.join(
      __dirname,
      "../../../files/" + timeStamp + ".exe"
    );

    fs.writeFile(p, code, err => {
      if (err) throw err;
    });

    const compile = spawn("g++", ["-o", filePath, p]);
    let out = "";
    compile.stderr.on("data", async data => {
      out += data;
    });
    compile.on("close", data => {
      if (data === 0) {
        const run = spawn(filePath, []);

        [...input].forEach(e => run.stdin.write(e + " "));
        run.stdin.end();
        run.stdout.on("data", async output => {
          fs.unlink(p, (err) => {
              if (err) throw err;
          });
          fs.unlink(filePath, (err) => {
              if (err) throw err;
          });

           res.send(String(output));
          
        });
      }
      else res.send("error");
    });
  });
};
