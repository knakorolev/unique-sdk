export class BadSignatureError extends Error {
  constructor(message = 'Bad signature') {
    super(message);
    this.name = BadSignatureError.name;
  }
}
