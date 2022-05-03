/* eslint-disable @typescript-eslint/ban-types */
import { LeanDocument, Query } from 'mongoose';
import { UserDocument } from '../../../modules/users/schemas/user.schema';

export type QueryUserDocument = Query<
  LeanDocument<UserDocument> | null,
  LeanDocument<UserDocument>,
  {},
  LeanDocument<UserDocument>
>;
