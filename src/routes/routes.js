import { codeCompiler } from "../code-compiler";

export const apiRoutes = async router => {
  // default welcome route
  router.get("/", async (req, res) => {
    res.send("Compiler-API");
  });
  router.post("/compile", async (req, res) => {
    const code = req.body.params.code;
    const input = req.body.params.input.split("\n");
    const options = {
      fileName: req.body.params.timeStamp,
      input:  req.body.params.input,
      language: req.body.params.language,
      timeout: req.body.params.timeout
    };
    const output = await codeCompiler(code, options);
    res.send(output);
  });
};
