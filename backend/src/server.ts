import app from "./app";
import "dotenv/config";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("MongoDB connection established");
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
})
.catch(console.error);

