import { Inject, Injectable, Logger } from '@nestjs/common';
import { FIREBASE_APP } from 'constants/provider-names.constant';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseNotificationRepository {
  #collection: FirebaseFirestore.CollectionReference;
  private readonly logger: Logger = new Logger(
    FirebaseNotificationRepository.name,
  );

  constructor(@Inject(FIREBASE_APP) private firebaseApp: app.App) {
    const db = this.firebaseApp.firestore();
    this.#collection = db.collection('notifications');
  }

  async storeUpdatedEmployeeNotification(employeeEmail: string) {
    const payload = {
      employeeEmail,
      updatedAt: new Date(),
    };

    this.logger.log(`storing notification to firebase with payload:`);
    this.logger.log(JSON.stringify(payload));
    const doc = await this.#collection.add(payload);

    return doc.id;
  }
}
