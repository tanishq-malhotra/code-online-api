import fs from "fs";
import path from "path";

import { gpp } from "./compilers";

const file_types = {
  "c++": {
    extension: "cpp",
    compiler: gpp
  },
  c: {
    extension: "c",
    compiler: gpp
  }
};

export const codeCompiler = async (code, options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      reject("no options provided");
      return;
    }
    if (!file_types[options.language]) {
      reject("unknown language");
      return;
    }
    options.input = options.input || "";
    //options.timeout = options.timeout || 100;
    const fileName = options.fileName;
    const extension = "." + file_types[options.language].extension;
    const compiler = file_types[options.language].compiler;
    const filePath = path.join(__dirname, "../../files/");
    fs.writeFile(filePath + fileName + extension, code, async err => {
      if (err) throw err;
      try {
        const output = await compiler(fileName, filePath, options, extension);
        resolve(output);
      } catch (err) {
        resolve(err);
      }
    });
  });
};
