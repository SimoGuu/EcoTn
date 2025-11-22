const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
   response.json(
       {
           status: 200,
           result: null,
           message: "Hello, World!",
           debug: null
       }
   );
});

app.listen(port, () => {
    console.log("API started on port: " + port);
});