import express, { Application } from "express";
import routes from "./src/routes/routes"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from 'body-parser';

dotenv.config()
const app: Application = express()
const PORT = process.env.PORT
// Express routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));

app.use("/api", routes)


const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`The app is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log((error as Error).message)
    }
}

appStart()