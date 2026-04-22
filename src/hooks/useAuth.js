import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Use LocalStorage to eliminate lag and offline issues completely
        const stored = localStorage.getItem(`dflix_${currentUser.uid}`);
        if (stored) {
          setUserData(JSON.parse(stored));
        } else {
          const newData = {
            email: currentUser.email,
            watched: [], liked: [], likedGenres: [], watchedGenres: [], history: []
          };
          localStorage.setItem(`dflix_${currentUser.uid}`, JSON.stringify(newData));
          setUserData(newData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    // Listen for custom event to update state when localstorage changes (like/watch)
    const handleStorageChange = () => {
      if (auth.currentUser) {
        const stored = localStorage.getItem(`dflix_${auth.currentUser.uid}`);
        if (stored) setUserData(JSON.parse(stored));
      }
    };
    window.addEventListener('dflix_update', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('dflix_update', handleStorageChange);
    }
  }, []);

  return { user, userData, loading };
};
