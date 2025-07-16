import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";

import "dotenv/config";

// init arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        shield({mode:"LIVE"}), // Protection for our web app (SQL Injfection, XSS, CSRF)
        detectBot({
            mode:"LIVE",
            allow:["CATEGORY:SEARCH_ENGINE"] // Block all bots except search engines
        }),
        tokenBucket({
            mode:"LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }) // RATE LIMITING
    ]
})