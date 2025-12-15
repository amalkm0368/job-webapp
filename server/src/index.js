import express from "express"
import "dotenv/config"
import cors from "cors"
import { connectDb } from "./config/Db.js"
import path from "path"

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")))

//routes
import authRoutes from "./routes/auth.route.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"
app.use("/api/auth", authRoutes)

app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)

const port = process.env.PORT
app.listen(port, () => {
  console.log("server runing on port :" + port)
  connectDb()
})
