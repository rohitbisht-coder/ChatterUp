import { server } from "./index.js";
import { mongooseConnect } from "./config.js";
server.listen(3000 , ()=>{
    console.log("server is listening on 3000 ")
    mongooseConnect();
})