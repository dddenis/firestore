import type * as firestore from '@google-cloud/firestore';
import { FirestoreEnv, getFirestoreDataLoader } from './FirestoreEnv';
import { DocumentNotFoundError } from './utils/error';

export function find<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
): Promise<firestore.DocumentSnapshot<T>> {
  return getFirestoreDataLoader(env).load(documentRef) as Promise<firestore.DocumentSnapshot<T>>;
}

export async function get<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
): Promise<firestore.QueryDocumentSnapshot<T>> {
  const snapshot = await find(env, documentRef);
  if (!isQueryDocumentSnapshot(snapshot)) {
    throw new DocumentNotFoundError(documentRef);
  }
  return snapshot;
}

function isQueryDocumentSnapshot<T>(
  snapshot: firestore.DocumentSnapshot<T>,
): snapshot is firestore.QueryDocumentSnapshot<T> {
  return !!snapshot.data();
}

export async function set<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
  data: firestore.WithFieldValue<T>,
): Promise<firestore.WriteResult>;
export async function set<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
  data: firestore.PartialWithFieldValue<T>,
  options: firestore.SetOptions,
): Promise<firestore.WriteResult>;
export async function set<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
  data: firestore.WithFieldValue<T>,
  options?: firestore.SetOptions,
): Promise<firestore.WriteResult> {
  const result = options ? await documentRef.set(data, options) : await documentRef.set(data);
  getFirestoreDataLoader(env).clear(documentRef);
  return result;
}

export async function update<T>(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference<T>,
  data: firestore.UpdateData<T>,
  precondition?: firestore.Precondition,
): Promise<firestore.WriteResult> {
  const result = precondition
    ? await documentRef.update(data, precondition)
    : await documentRef.update(data);
  getFirestoreDataLoader(env).clear(documentRef);
  return result;
}

async function _delete(
  env: FirestoreEnv,
  documentRef: firestore.DocumentReference,
  precondition?: firestore.Precondition,
): Promise<firestore.WriteResult> {
  const result = await documentRef.delete(precondition);
  getFirestoreDataLoader(env).clear(documentRef);
  return result;
}

export { _delete as delete };
