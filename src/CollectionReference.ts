import type * as firestore from '@google-cloud/firestore';
import * as collection from './collection';
import { createDocumentReference, DocumentReference } from './DocumentReference';
import type { FirestoreEnv } from './FirestoreEnv';

export interface CollectionReference<T> {
  readonly doc: (path: string) => DocumentReference<T>;
  readonly get: () => Promise<firestore.QuerySnapshot<T>>;
}

export function createCollectionReference<T>(
  env: FirestoreEnv,
  collectionRef: firestore.CollectionReference<T>,
): CollectionReference<T> {
  return {
    doc: (path) => {
      return createDocumentReference(env, collectionRef.doc(path));
    },

    get: () => {
      return collection.get(env, collectionRef);
    },
  };
}
