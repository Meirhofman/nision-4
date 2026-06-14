import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { getFirebaseFirestore } from '../../lib/firebase';
import { useApp } from '../context/AppContext';
import { MobileContainer } from '../components/MobileContainer';
import { NewTopBar } from '../components/NewTopBar';

interface JoinedActivity {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'completed';
}

export const JoinedActivitiesScreen = () => {
  const { currentUser, t } = useApp();
  const [activities, setActivities] = useState<JoinedActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const db = getFirebaseFirestore();
      if (!db || !currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, `users/${currentUser.uid}/joinedActivities`));
        const querySnapshot = await getDocs(q);
        const data: JoinedActivity[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as JoinedActivity);
        });
        
        // Example fallback data if empty (for UI testing)
        if (data.length === 0) {
          data.push(
            { id: '1', name: 'ריצת בוקר בפארק', date: '2023-11-01', status: 'completed' },
            { id: '2', name: 'אימון כוח קבוצתי', date: '2023-12-15', status: 'upcoming' }
          );
        }

        setActivities(data);
      } catch (error) {
        console.error('Error fetching joined activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser]);

  return (
    <MobileContainer className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <NewTopBar title="הפעילויות שלי" />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-xl font-black text-gray-900 mb-6 text-right">הפעילויות שהצטרפתי אליהן</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            לא נמצאו פעילויות.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white p-5 rounded-2xl border-[0.5px] border-[#F0F0F0] flex justify-between items-center text-right">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg mb-1">{activity.name}</span>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activity.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {activity.status === 'completed' ? 'הושלם' : 'עתידי'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileContainer>
  );
};
