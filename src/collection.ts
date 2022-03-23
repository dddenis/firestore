import type * as firestore from '@google-cloud/firestore';
import { FirestoreEnv, getFirestoreDataLoader } from './FirestoreEnv';

export async function get<T>(
  env: FirestoreEnv,
  collectionRef: firestore.CollectionReference<T>,
): Promise<firestore.QuerySnapshot<T>> {
  const querySnapshot = await collectionRef.get();

  for (const snapshot of querySnapshot.docs) {
    getFirestoreDataLoader(env).clear(snapshot.ref).prime(snapshot.ref, snapshot);
  }

  return querySnapshot;
}
