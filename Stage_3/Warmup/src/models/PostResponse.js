class PostResponse {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.userId = data.userId;
  }
  hasTitle() {
    return !!this.title && this.title.length > 0;
  }
}
module.exports = { PostResponse };