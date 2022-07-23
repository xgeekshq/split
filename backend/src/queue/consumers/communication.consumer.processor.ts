import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';

export default function (job: Job, cb: DoneCallback) {
	Logger.verbose(`${job.data.message} (pid ${process.pid})`);
	// console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);
	cb(null, 'It works');
}
