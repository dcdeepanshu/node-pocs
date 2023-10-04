const express = require('express');
const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started & listening at port ${PORT}`)
})

app.get('/test', (req, res) => res.send('hello!'));

app.get('/stream', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    emitEvent(res);

    setTimeout(() => res.end(), 10000);
});

let eventIdx = 0;
const emitEvent = (res) => {
    const message = `Server pushed new event ${eventIdx++}`;
    res.write(`data: ${message}\n\n`);
    console.log(message);
    setTimeout(() => emitEvent(res), 1000);
}



/* 
Client Code >> Use EventSource api

const sse = new EventSource("http://localhost:8888/stream");
sse.onmessage = console.log
sse.onerror = (err) => console.error("EventSource failed:", err);

sse.close();

*/