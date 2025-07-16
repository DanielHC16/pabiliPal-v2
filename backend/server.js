import express from "express";
import helmet from "helmet";
// import morgan from "morgan"; deprecated (Used for logging requests)
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Routes
import productRoutes from "./routes/productRoutes.js";

// Database
import { sql } from "./config/db.js"

// Arcjet
import { aj } from "./lib/arcjet.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve(); // to get the current directory

app.use(express.json()); // middleware to parse json
app.use(cors()); // to avoid cors errors
app.use(helmet({
    contentSecurityPolicy: false, // disable CSP for now, can be configured later
})); // middleware to get headers
app.use((req, _res, next) => {
    console.log("Request Method: ", req.method + ' | Request URL: ', req.url);
    next();
}); // JUST TO LOG REQUESTS 

// arcjet rate-limit to all routes
// TODO: sliding window feature

app.use(async (req, res, next) =>{
    try {
        const decision = await aj.protect(req, {
            requested: 1 // specifies that each request consumes 1 token
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({error: "Too many requests"});
            } else if (decision.reason.isBot()){
                res.status(403).json({error: "Bot access denied"});
            } else {
                res.status(403).json({error: "Forbidden"});
            }
            return
        }

        // check for spoofed bots 
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({error: "Spoofed bot detected"});
            return;
        }

        next();
    } catch (error) {
        console.log("Arcjet Error", error);
        next(error);
    }
})



app.use("/api/products", productRoutes);

if(process.env.NODE_ENV === "production") {
    // server our react app
    app.use(express.static(path.join(__dirname, "/frontend/dist"))) // __dirname is the root directory of the project

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}



async function initDB(){
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Database Initialized Succesfully");
        console.log("Server is running on port: " + PORT);
    });
}).catch(error => {
    console.error("Failed to initialize DB:", error);
});

