
export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.user = data.author;
    this.comment = data.comment;
    this.date = new Date(data.date);
    this.emoji = `${data.emotion}.png`;
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static paserPOSTResponse(data) {
    return new Comment(data.comments.pop());
  }
}
