import { DoneCallback, Job } from 'bull';

export default function (job: Job, cb: DoneCallback) {
	console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);
	cb(null, 'It works');
}
