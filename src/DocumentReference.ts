import type * as firestore from '@google-cloud/firestore';
import * as document from './document';
import type { FirestoreEnv } from './FirestoreEnv';

export interface DocumentReference<T> {
  readonly find: () => Promise<firestore.DocumentSnapshot<T>>;
  readonly get: () => Promise<firestore.QueryDocumentSnapshot<T>>;
  readonly set: firestore.DocumentReference<T>['set'];
  readonly update: (
    data: firestore.UpdateData<T>,
    precondition?: firestore.Precondition,
  ) => Promise<firestore.WriteResult>;
  readonly delete: (precondition?: firestore.Precondition) => Promise<firestore.WriteResult>;
}

export function createDocumentReference<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
): DocumentReference<T> {
  return {
    find: () => {
      return document.find(env, documentRef);
    },

    get: () => {
      return document.get(env, documentRef);
    },

    set: ((data, options) => {
      return document.set(env, documentRef, data, options);
    }) as DocumentReference<T>['set'],

    update: (...args) => {
      return document.update(env, documentRef, ...args);
    },

    delete: (...args) => {
      return document.delete(env, documentRef, ...args);
    },
  };
}
