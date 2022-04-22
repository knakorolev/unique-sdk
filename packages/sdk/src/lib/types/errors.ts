export class SdkError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = SdkError.name;
  }
}

export class BadSignatureError extends SdkError {
  constructor(message = 'Bad signature') {
    super(message);
    this.name = BadSignatureError.name;
  }
}
