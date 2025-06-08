import { Module } from '@nestjs/common';
import { FIREBASE_APP } from 'constants/provider-names.constant';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import { FirebaseNotificationRepository } from './firebase-notification.repository';

const firebaseProvider = {
  provide: FIREBASE_APP,
  useFactory: () => {
    try {
      const keyFile = fs.readFileSync('firebase.key.json');
      const plainKey = JSON.parse(keyFile.toString()) as Record<string, string>;
      const requiredKeys = ['client_email', 'private_key', 'project_id'];
      for (const key of requiredKeys) {
        if (!plainKey[key]) {
          throw new Error(`Firebase key file is missing ${key}`);
        }
      }

      const parsedKey: admin.ServiceAccount = {
        clientEmail: plainKey.client_email,
        privateKey: plainKey.private_key,
        projectId: plainKey.project_id,
      };

      return admin.initializeApp({
        credential: admin.credential.cert(parsedKey),
        databaseURL: `https://${plainKey.project_id}.firebaseio.com`,
        storageBucket: `${plainKey.project_id}.appspot.com`,
      });
    } catch (err) {
      console.error(err);
      throw new Error('Firebase key file not found');
    }
  },
};

@Module({
  providers: [firebaseProvider, FirebaseNotificationRepository],
  exports: [FirebaseNotificationRepository],
})
export class FirebaseModule {}
