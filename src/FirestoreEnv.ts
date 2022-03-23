import type * as firestore from '@google-cloud/firestore';
import DataLoader from 'dataloader';

export type FirestoreEnv = {
  readonly [S in typeof FirestoreSymbol]: FirestoreDataLoader;
};

const FirestoreSymbol = Symbol('Firestore');

export type FirestoreEnvConfig = FirestoreDataLoaderConfig;

export function createFirestoreEnv(config: FirestoreEnvConfig): FirestoreEnv {
  return {
    [FirestoreSymbol]: createFirestoreDataLoader(config),
  };
}

export type FirestoreDataLoader = DataLoader<
  firestore.DocumentReference,
  firestore.DocumentSnapshot,
  string
>;

export type FirestoreDataLoaderConfig = {
  firestore: firestore.Firestore;
  options?: FirestoreDataLoaderOptions;
};

export type FirestoreDataLoaderOptions = Omit<
  DataLoader.Options<firestore.DocumentReference, firestore.DocumentSnapshot, string>,
  'cacheKeyFn'
>;

export function getFirestoreDataLoader(env: FirestoreEnv): FirestoreDataLoader {
  return env[FirestoreSymbol];
}

function createFirestoreDataLoader(config: FirestoreDataLoaderConfig): FirestoreDataLoader {
  return new DataLoader(
    async (documents: readonly firestore.DocumentReference[]) => {
      const snapshots = await config.firestore.getAll(...documents);

      const snapshotsByPath = snapshots.reduce(
        (acc: Record<string, firestore.DocumentSnapshot>, snapshot) => {
          acc[snapshot.ref.path] = snapshot;
          return acc;
        },
        {},
      );

      return documents.map((document) => snapshotsByPath[document.path]);
    },
    {
      ...config.options,
      cacheKeyFn: (document) => document.path,
    },
  );
}
