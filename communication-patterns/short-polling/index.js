const app = require("express")();

const jobs = {}

app.post("/job/submit", (req, res, next) => {
    const jobId = `job:${Date.now()}`;
    const progress = 0;
    jobs[jobId] = progress;
    updateJob(jobId, progress); 
    res.end(jobId);
});

app.get("/job/status", (req, res) => {
    console.log(req.query.jobId)
    console.log(JSON.stringify(jobs))
    res.end(`Job Progress: ${jobs[`job:${req.query.jobId}`]} %`);
});

app.listen(8888, () => console.log("listening on 8888"));

const updateJob = (jobId, progress) => {
    jobs[jobId] = progress;
    console.log(`updated ${jobId} to ${progress}`);
    if (progress == 100) return;
    setTimeout(() => updateJob(jobId, progress + 10), 3000);
}
