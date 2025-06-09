import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

type Notification = {
  id: string;
  employeeEmail: string;
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export function useFirebase() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const previousIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true); // 👈 track first load

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const newData: Notification[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Notification, 'id'>),
          }))
          .sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds);

        const newIds = new Set(newData.map((n) => n.id));
        const previousIds = previousIdsRef.current;

        const newlyAdded = newData.filter((n) => !previousIds.has(n.id));

        // Skip toast if it's the first load after page refresh
        if (!isFirstLoadRef.current && newlyAdded.length > 0) {
          newlyAdded.forEach((n) => {
            toast('Employee update notification', {
              description: `Employee ${n.employeeEmail} updated their profile`,
              descriptionClassName: 'text-black',
              duration: 10000,
            });
          });
        }

        previousIdsRef.current = newIds;
        isFirstLoadRef.current = false; // 👈 mark first load done
        setNotifications(newData);
      },
      (error) => {
        console.error('Firestore error: ', error);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return { notifications };
}
