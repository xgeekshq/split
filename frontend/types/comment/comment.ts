export default interface CommentType {
  _id: string;
  text: string;
  createdBy: string;
  isNested?: boolean;
}
