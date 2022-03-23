import type * as firestore from '@google-cloud/firestore';

export class DocumentNotFoundError extends Error {
  readonly ref: firestore.DocumentReference;

  constructor(ref: firestore.DocumentReference) {
    super(`Firestore document "${ref.path}" not found`);
    this.ref = ref;
    Object.defineProperty(this, 'name', { value: 'DocumentNotFoundError' });
  }
}
