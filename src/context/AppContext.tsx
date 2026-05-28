import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { collection, onSnapshot, getDocs, writeBatch, doc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import type { Machine, Chemical, Tool, Area, Package, MappingRecord } from '../types';

// Import static fallbacks
import { defaultPackages } from '../data/packages';
import { defaultAreas } from '../data/areas';
import { defaultMachines } from '../data/machines';
import { defaultChemicals } from '../data/chemicals';
import { defaultTools } from '../data/tools';
import { defaultMappings } from '../data/initialData';

interface AppContextType {
  packages: Package[];
  areas: Area[];
  machines: Machine[];
  chemicals: Chemical[];
  tools: Tool[];
  mappings: MappingRecord[];
  loading: boolean;
  
  // Interactive UI State
  activePackage: string | null;
  setActivePackage: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredArea: string | null;
  setHoveredArea: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMachineId: string | null;
  setSelectedMachineId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedChemicalId: string | null;
  setSelectedChemicalId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedToolId: string | null;
  setSelectedToolId: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Authentication State
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Trigger re-seed manually if needed
  triggerSeed: () => Promise<void>;
  useStaticFallback: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Database States
  const [packages, setPackages] = useState<Package[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [mappings, setMappings] = useState<MappingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  // Interactive UI States
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedChemicalId, setSelectedChemicalId] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(!!user); // In our simple admin auth, any logged-in user is an admin
    });
    return unsubscribe;
  }, []);

  // Helper function to seed database if empty
  const triggerSeed = async () => {
    try {
      console.log('Starting Karcher Database Seed...');
      
      // Check if mappings are empty
      const mappingsSnap = await getDocs(collection(db, 'mappings'));
      if (!mappingsSnap.empty) {
        console.log('Database already has data. Skipping seed.');
        return;
      }

      const batch = writeBatch(db);

      // Seed Packages
      defaultPackages.forEach((pkg) => {
        const docRef = doc(collection(db, 'packages'), pkg.id);
        batch.set(docRef, pkg);
      });

      // Seed Areas
      defaultAreas.forEach((area) => {
        const docRef = doc(collection(db, 'areas'), area.id);
        batch.set(docRef, area);
      });

      // Seed Machines
      defaultMachines.forEach((m) => {
        const docRef = doc(collection(db, 'machines'), m.id);
        batch.set(docRef, m);
      });

      // Seed Chemicals
      defaultChemicals.forEach((c) => {
        const docRef = doc(collection(db, 'chemicals'), c.id);
        batch.set(docRef, c);
      });

      // Seed Tools
      defaultTools.forEach((t) => {
        const docRef = doc(collection(db, 'tools'), t.id);
        batch.set(docRef, t);
      });

      // Seed Mappings
      defaultMappings.forEach((mapping) => {
        const docRef = doc(collection(db, 'mappings'), mapping.id);
        batch.set(docRef, mapping);
      });

      await batch.commit();
      console.log('Karcher Database Seed Completed Successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  };

  // 2. Real-time Firestore Listeners
  useEffect(() => {
    let unsubscribes: (() => void)[] = [];
    let isConnected = true;

    // A timeout to detect offline/mock environment and switch to static fallback
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.warn('Firestore connection timeout. Switching to local static fallback.');
        setUseStaticFallback(true);
        setPackages(defaultPackages);
        setAreas(defaultAreas);
        setMachines(defaultMachines);
        setChemicals(defaultChemicals);
        setTools(defaultTools);
        setMappings(defaultMappings);
        setLoading(false);
      }
    }, 4000); // 4 seconds timeout

    try {
      // Set up real-time listener for Packages
      const unsubPackages = onSnapshot(collection(db, 'packages'), 
        (snapshot) => {
          if (snapshot.empty && isConnected) {
            // Seed database if we detect everything is empty
            triggerSeed().catch(err => console.error('Auto seed failed', err));
          } else {
            const list: Package[] = [];
            snapshot.forEach((doc) => list.push(doc.data() as Package));
            setPackages(list);
          }
        }, 
        (error) => {
          console.error('Firestore Packages subscription failed:', error);
          setUseStaticFallback(true);
        }
      );
      unsubscribes.push(unsubPackages);

      // Areas
      const unsubAreas = onSnapshot(collection(db, 'areas'), 
        (snapshot) => {
          const list: Area[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Area));
          // Keep default sorting order
          const sorted = list.sort((a, b) => {
            const indexA = defaultAreas.findIndex(da => da.id === a.id);
            const indexB = defaultAreas.findIndex(da => da.id === b.id);
            return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
          });
          setAreas(sorted.length > 0 ? sorted : defaultAreas);
        },
        (error) => console.error(error)
      );
      unsubscribes.push(unsubAreas);

      // Machines
      const unsubMachines = onSnapshot(collection(db, 'machines'), 
        (snapshot) => {
          const list: Machine[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Machine));
          setMachines(list.length > 0 ? list : defaultMachines);
        },
        (error) => console.error(error)
      );
      unsubscribes.push(unsubMachines);

      // Chemicals
      const unsubChemicals = onSnapshot(collection(db, 'chemicals'), 
        (snapshot) => {
          const list: Chemical[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Chemical));
          setChemicals(list.length > 0 ? list : defaultChemicals);
        },
        (error) => console.error(error)
      );
      unsubscribes.push(unsubChemicals);

      // Tools
      const unsubTools = onSnapshot(collection(db, 'tools'), 
        (snapshot) => {
          const list: Tool[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as Tool));
          setTools(list.length > 0 ? list : defaultTools);
        },
        (error) => console.error(error)
      );
      unsubscribes.push(unsubTools);

      // Mappings
      const unsubMappings = onSnapshot(collection(db, 'mappings'), 
        (snapshot) => {
          const list: MappingRecord[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as MappingRecord));
          setMappings(list.length > 0 ? list : defaultMappings);
          setLoading(false);
          clearTimeout(fallbackTimer);
        },
        (error) => {
          console.error(error);
          setUseStaticFallback(true);
        }
      );
      unsubscribes.push(unsubMappings);

    } catch (err) {
      console.error('Failed to set up Firestore listeners, using fallback:', err);
      setUseStaticFallback(true);
      setPackages(defaultPackages);
      setAreas(defaultAreas);
      setMachines(defaultMachines);
      setChemicals(defaultChemicals);
      setTools(defaultTools);
      setMappings(defaultMappings);
      setLoading(false);
      clearTimeout(fallbackTimer);
    }

    return () => {
      isConnected = false;
      unsubscribes.forEach((unsub) => unsub());
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <AppContext.Provider value={{
      packages,
      areas,
      machines,
      chemicals,
      tools,
      mappings,
      loading,
      
      activePackage,
      setActivePackage,
      hoveredArea,
      setHoveredArea,
      selectedMachineId,
      setSelectedMachineId,
      selectedChemicalId,
      setSelectedChemicalId,
      selectedToolId,
      setSelectedToolId,
      
      currentUser,
      setCurrentUser,
      isAdmin,
      setIsAdmin,
      triggerSeed,
      useStaticFallback
    }}>
      {children}
    </AppContext.Provider>
  );
};
