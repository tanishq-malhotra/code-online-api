import { spawn, exec } from "child_process";
import path from "path";
import fs from "fs";

export const apiRoutes = async router => {
  // default welcome route
  router.get("/", async (req, res) => {
    res.send("Compiler-API");
  });

  router.post("/compile", async (req, res) => {
    let out = "";

    let p = path.join(__dirname, "../../files/temp.c++");
    let compile = spawn("g++", [p]);

    compile.stderr.on("data", async data => {
      out += data + "/n";
    });
    compile.on("close", data => {
      if (data === 0) {
        let run = spawn("./a.exe", []);

        run.stdin.write("" + req.body.n1 + " " + req.body.n2);
        run.stdin.end();
        run.stdout.on("data", output => {
          res.send(out + String(output));
        });
      } else res.send(out);
    });
  });

  router.post("/get-data", async (req, res) => {
    const code = req.body.info.code;
    const input = req.body.info.input.split("\n");

    let p = path.join(__dirname, "../../files/t.c++");
    fs.appendFile(p, code, err => {
      if (err) throw err;
    });

    let compile = spawn("g++", [p]);
    let out = "";
    compile.stderr.on("data", async data => {
      out += data;
    });
    compile.on("close", data => {
      if (data === 0) {
        let run = spawn("./a.exe", []);

        [...input].forEach(e => run.stdin.write(e+" "));
        // run.stdin.write("" + req.body.n1 + " " + req.body.n2);
        run.stdin.end();
        run.stdout.on("data", output => {
          fs.unlink(p, err => {
            if (err) throw err;
          });
          res.send(out + String(output));
        });
      } else {
        fs.unlink(p, err => {
          if (err) throw err;
        });
        res.send(out);
      }
    });
  });
};
