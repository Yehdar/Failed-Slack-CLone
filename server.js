import express from "express"
import mongoose, { get } from "mongoose"
import cors from "cors"
import Pusher from "pusher"
import mongoData from "./mongoData.js"

// app config
const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

// db config
const mongoURI = "mongodb+srv://blacksheep:QaIctFjmjGWe7v8x@cluster0.kreppqo.mongodb.net/SlackDB?retryWrites=true&w=majority"

mongoose.connection.once("open", () => {
    console.log("DB Connected")
})

// api routes
app.get("/", (req, res) => res.status(200).send("hello mate"))

app.post("/new/channel", (req, res) => {
    const dbData = req.body

    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.post("/new/message", (req, res) => {
    const id = req.query.id
    const newMessage = req.body

    mongoData.update(
        {_id: id},
        { $push: {conversation: newMessage} },
        (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        }
    )
})

app.get("/get/channelList", (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let channels = []

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo)
            })

            res.status(200).send(channels)
        }
    })
})

app.get("/get/conversation", (req, res) => {
    const id = req.query.id

    mongoData.find({ _id: id}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }    
    })
})

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`))