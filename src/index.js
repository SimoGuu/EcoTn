const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const WebApiController = require("./controllers/index");

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

app.use((request, response, next) => {
    WebApiController.sendError(
        request,
        response,
        404,
        {
            type: "not-found",
            title: "Resource not found",
            status: 404,
            details: "The requested resource was not found on this server."
        }
    );
});

app.listen(port, () => {
    console.log("API started on port: " + port);
});