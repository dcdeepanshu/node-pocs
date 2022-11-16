const app = require("express")();

const jobs = {}

app.post("/job/submit", (req, res, next) => {
    const jobId = `job:${Date.now()}`;
    const progress = 0;
    jobs[jobId] = progress;
    updateJob(jobId, progress); 
    res.end(jobId);
});

app.get("/job/status", async (req, res) => {
    const jobId = req.query.jobId;
    console.log(jobId)
    console.log(JSON.stringify(jobs))

    let isDone = false;
    do {
        console.log(`Job Progress: ${jobs[jobId]} %`);
        isDone = await isJobComplete(jobId)
    } while (!isDone);

    res.end(`Job Complete: ${jobs[jobId]} %`);
});

app.listen(8888, () => console.log("listening on 8888"));

const isJobComplete = async (jobId) => {
    return new Promise((resolve, reject) => {
        if (jobs[jobId] < 100) {
            setTimeout(() => resolve(false),  1000);
        } else {
            resolve(true);
        }
    })
}

const updateJob = (jobId, progress) => {
    jobs[jobId] = progress;
    console.log(`updated ${jobId} to ${progress}`);
    if (progress == 100) return;
    setTimeout(() => updateJob(jobId, progress + 10), 3000);
}
