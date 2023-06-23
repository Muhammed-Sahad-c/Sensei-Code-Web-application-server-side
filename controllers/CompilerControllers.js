import Axios from "axios";
import fs from "fs";

export const compilerControllers = {
  compileCode: async (req, res) => {
    fs.writeFile("mynewfile3.py", `${req.body}`, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  },
};
