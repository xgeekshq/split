import { randomBytes } from 'node:crypto';
import mongoose, { Document, Schema, model } from 'mongoose';
import { SoftDeleteModel, SoftDeletePlugin } from './soft-delete.plugin';

/**
 * To run this tests please remove '.ignore' from the name of the file,
 * these tests are ignored because they're intendend to be tested with a database
 * available at mongodb://127.0.0.1:27017/(generated automatically)
 * The database will be created (with a random name) at the beggining of the tests and dropped after they run
 */

describe('SoftDeletePlugin', () => {
	interface IPost extends Document {
		_id: string;
		name: string;
	}

	const PostSchema = new Schema({ name: String });
	PostSchema.plugin(SoftDeletePlugin);

	const PostModel = model<IPost, SoftDeleteModel<IPost>>('Post', PostSchema);

	const dbName = randomBytes(10).toString('hex');
	beforeAll(async () => {
		mongoose.set('strictQuery', false);
		await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
	});
	afterAll(async () => {
		await mongoose.connection.db.dropDatabase();
		await mongoose.disconnect();
	});

	it("should 'forceDelete' rows", async () => {
		await PostModel.create({ name: 'forceDeleteMany' });
		await PostModel.create({ name: 'forceDeleteMany' });
		expect(await PostModel.count().exec()).toBe(2);
		const resultFD = await PostModel.forceDelete({ name: 'forceDeleteMany' });
		expect(resultFD.deletedCount).toBe(2);
		expect(await PostModel.count().exec()).toBe(0);
	});
	it("should 'softDelete' row", async () => {
		const row = await PostModel.create({ name: 'softDelete' });
		expect(await PostModel.count().exec()).toBe(1);
		await PostModel.softDelete({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(1);
		await PostModel.forceDelete({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(0);
	});
	it("should 'findDeleted' row", async () => {
		const row = await PostModel.create({ name: 'findDeleted' });
		expect(await PostModel.count().exec()).toBe(1);
		await PostModel.deleteOne({ _id: row._id.toString() }).exec();
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(1);
		await PostModel.forceDelete({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(0);
	});
	it("should 'countDeleted' row", async () => {
		const row = await PostModel.create({ name: 'countDeleted' });
		expect(await PostModel.count().exec()).toBe(1);
		await PostModel.deleteOne({ _id: row._id.toString() }).exec();
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.countDeleted()).toBe(1);
		await PostModel.forceDelete({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.countDeleted()).toBe(0);
	});
	it("should 'restore' row", async () => {
		const row = await PostModel.create({ name: 'restore' });
		expect(await PostModel.count().exec()).toBe(1);
		await PostModel.deleteOne({ _id: row._id.toString() }).exec();
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(1);
		await PostModel.restore({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(1);
		expect(await PostModel.findDeleted()).toHaveLength(0);
		await PostModel.forceDelete({ _id: row._id.toString() });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(0);
	});
	it("should 'restoreMany' rows", async () => {
		await PostModel.create({ name: 'restoreMany' });
		await PostModel.create({ name: 'restoreMany' });
		expect(await PostModel.count().exec()).toBe(2);
		await PostModel.deleteMany({ name: 'restoreMany' }).exec();
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(2);
		await PostModel.restore({ name: 'restoreMany' });
		expect(await PostModel.count().exec()).toBe(2);
		expect(await PostModel.findDeleted()).toHaveLength(0);
		await PostModel.forceDelete({ name: 'restoreMany' });
		expect(await PostModel.count().exec()).toBe(0);
		expect(await PostModel.findDeleted()).toHaveLength(0);
	});
	describe('mongoose middleware functions - query', () => {
		afterEach(async () => {
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(0);
		});
		it("should not 'find' deleted rows", async () => {
			await PostModel.create({ name: 'find' });
			await PostModel.create({
				name: 'find',
				isDeleted: true,
				deletedAt: new Date()
			});
			expect(await PostModel.find().exec()).toHaveLength(1);
			expect(await PostModel.findDeleted()).toHaveLength(1);
			await PostModel.forceDelete({ name: 'find' });
		});
		it("should not 'count' deleted rows", async () => {
			await PostModel.create({ name: 'find' });
			await PostModel.create({
				name: 'find',
				isDeleted: true,
				deletedAt: new Date()
			});
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.findDeleted()).toHaveLength(1);
			await PostModel.forceDelete({ name: 'find' });
		});
		it("should not 'countDocuments' deleted rows", async () => {
			await PostModel.create({ name: 'find' });
			await PostModel.create({
				name: 'find',
				isDeleted: true,
				deletedAt: new Date()
			});
			expect(await PostModel.countDocuments().exec()).toBe(1);
			expect(await PostModel.findDeleted()).toHaveLength(1);
			await PostModel.forceDelete({ name: 'find' });
		});
		it("should not 'findOne' deleted rows", async () => {
			await PostModel.create({ name: 'find' });
			const row = await PostModel.create({
				name: 'find',
				isDeleted: true,
				deletedAt: new Date()
			});
			expect(await PostModel.findOne({ _id: row._id.toString() })).toBe(null);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({ name: 'find' });
		});
		it("should not 'findOneAndUpdate' deleted rows", async () => {
			const row = await PostModel.create({ name: 'findOneAndUpdate' });
			const rowDeleted = await PostModel.create({
				name: 'findOneAndUpdate',
				isDeleted: true,
				deletedAt: new Date()
			});
			await PostModel.findOneAndUpdate(
				{ _id: row._id.toString() },
				{ $set: { name: 'updated' } }
			).exec();
			await PostModel.findOneAndUpdate(
				{ _id: rowDeleted._id.toString() },
				{ $set: { name: 'updated' } }
			).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'findOneAndUpdate'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'updateOne' deleted rows", async () => {
			const row = await PostModel.create({ name: 'updateOne' });
			const rowDeleted = await PostModel.create({
				name: 'updateOne',
				isDeleted: true,
				deletedAt: new Date()
			});
			await PostModel.updateOne({ _id: row._id.toString() }, { $set: { name: 'updated' } }).exec();
			await PostModel.updateOne(
				{ _id: rowDeleted._id.toString() },
				{ $set: { name: 'updated' } }
			).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'updateOne'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'updateMany' deleted rows", async () => {
			const row = await PostModel.create({ name: 'updateMany' });
			const rowDeleted = await PostModel.create({
				name: 'updateMany',
				isDeleted: true,
				deletedAt: new Date()
			});
			await PostModel.updateMany({ name: 'updateMany' }, { $set: { name: 'updated' } }).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'updateMany'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'findOneAndReplace' deleted rows", async () => {
			const row = await PostModel.create({ name: 'findOneAndReplace' });
			const rowDeleted = await PostModel.create({
				name: 'findOneAndReplace',
				isDeleted: true,
				deletedAt: new Date()
			});
			await PostModel.findOneAndReplace({ _id: row._id.toString() }, { name: 'updated' }).exec();
			await PostModel.findOneAndReplace(
				{ _id: rowDeleted._id.toString() },
				{ name: 'updated' }
			).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'findOneAndReplace'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'replaceOne' deleted rows", async () => {
			const row = await PostModel.create({ name: 'replaceOne' });
			const rowDeleted = await PostModel.create({
				name: 'replaceOne',
				isDeleted: true,
				deletedAt: new Date()
			});
			await PostModel.replaceOne({ _id: row._id.toString() }, { name: 'updated' }).exec();
			await PostModel.replaceOne({ _id: rowDeleted._id.toString() }, { name: 'updated' }).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'replaceOne'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("set state isDeleted with 'deleteOne'", async () => {
			const row = await PostModel.create({ name: 'deleteOne' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			const result = await PostModel.deleteOne({ _id: row._id.toString() });
			expect(result.deletedCount).toBe(1);
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
		it("set state isDeleted with 'deleteMany'", async () => {
			await PostModel.create({ name: 'deleteMany' });
			await PostModel.create({ name: 'deleteMany' });
			expect(await PostModel.count().exec()).toBe(2);
			expect(await PostModel.countDeleted()).toBe(0);
			const result = await PostModel.deleteMany({ name: 'deleteMany' }).exec();
			expect(result.deletedCount).toBe(2);
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(2);
			await PostModel.forceDelete({
				name: 'deleteMany'
			});
		});
		it("set state isDeleted with 'findOneAndDelete'", async () => {
			const row = await PostModel.create({ name: 'findOneAndDelete' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			const result = await PostModel.findByIdAndDelete({ _id: row._id.toString() });
			expect(result._id.toString()).toBe(row._id.toString());
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
		it("set state isDeleted with 'findOneAndRemove'", async () => {
			const row = await PostModel.create({ name: 'findOneAndRemove' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			const result = await PostModel.findOneAndRemove({ _id: row._id.toString() });
			expect(result._id.toString()).toBe(row._id.toString());
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
	});
	describe('mongoose middleware functions - document', () => {
		afterEach(async () => {
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(0);
		});
		it("should not 'update' deleted rows", async () => {
			const row = await PostModel.create({ name: 'update' });
			const rowDeleted = await PostModel.create({
				name: 'update',
				isDeleted: true,
				deletedAt: new Date()
			});
			await row.update({ $set: { name: 'updated' } }).exec();
			await rowDeleted.update({ $set: { name: 'updated' } }).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'update'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'updateOne' deleted rows", async () => {
			const row = await PostModel.create({ name: 'updateOne' });
			const rowDeleted = await PostModel.create({
				name: 'updateOne',
				isDeleted: true,
				deletedAt: new Date()
			});
			await row.updateOne({ $set: { name: 'updated' } }).exec();
			await rowDeleted.updateOne({ $set: { name: 'updated' } }).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'updateOne'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("should not 'replaceOne' deleted rows", async () => {
			const row = await PostModel.create({ name: 'replaceOne' });
			const rowDeleted = await PostModel.create({
				name: 'replaceOne',
				isDeleted: true,
				deletedAt: new Date()
			});
			await row.replaceOne({ name: 'updated' }).exec();
			await rowDeleted.replaceOne({ name: 'updated' }).exec();
			expect(await PostModel.findOne({ _id: row._id.toString() })).toHaveProperty(
				'name',
				'updated'
			);
			expect((await PostModel.findDeleted({ _id: rowDeleted._id.toString() }))[0]).toHaveProperty(
				'name',
				'replaceOne'
			);
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: { $in: [row._id.toString(), rowDeleted._id.toString()] }
			});
		});
		it("set state isDeleted with 'deleteOne'", async () => {
			const row = await PostModel.create({ name: 'deleteOne' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			await row.deleteOne();
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
		it("set state isDeleted with 'delete'", async () => {
			const row = await PostModel.create({ name: 'delete' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			await row.delete();
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
		it("set state isDeleted with 'remove'", async () => {
			const row = await PostModel.create({ name: 'remove' });
			expect(await PostModel.count().exec()).toBe(1);
			expect(await PostModel.countDeleted()).toBe(0);
			await row.remove();
			expect(await PostModel.count().exec()).toBe(0);
			expect(await PostModel.countDeleted()).toBe(1);
			await PostModel.forceDelete({
				_id: row._id.toString()
			});
		});
	});
});
