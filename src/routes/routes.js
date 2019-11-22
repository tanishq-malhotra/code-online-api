import { spawn, exec } from "child_process";
import path from "path";
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
};
