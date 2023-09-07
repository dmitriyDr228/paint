const express = require('express')
const app = express();
const WBServer = require('express-ws')(app)
const aWss = WBServer.getWss();
const cors = require('cors')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    ws.on('message', msg => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg);
                break;
            case "draw":
                broadcastConnection(ws, msg);
                break;
        }
    })
})
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
}
const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            console.log(client.id)
            console.log(msg.id)
            client.send(JSON.stringify(msg))
        }
    })

}