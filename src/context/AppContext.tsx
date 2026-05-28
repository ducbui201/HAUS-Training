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
  
  // Comparison State
  comparedMachineIds: string[];
  setComparedMachineIds: React.Dispatch<React.SetStateAction<string[]>>;
  comparedChemicalIds: string[];
  setComparedChemicalIds: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Simulator State
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  simStep: number;
  setSimStep: React.Dispatch<React.SetStateAction<number>>;
  
  // Quiz State
  isQuizMode: boolean;
  setIsQuizMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  quizSelectedMachineId: string | null;
  setQuizSelectedMachineId: React.Dispatch<React.SetStateAction<string | null>>;
  quizSelectedChemicalId: string | null;
  setQuizSelectedChemicalId: React.Dispatch<React.SetStateAction<string | null>>;
  quizScore: number;
  setQuizScore: React.Dispatch<React.SetStateAction<number>>;
  
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

  // Comparison States
  const [comparedMachineIds, setComparedMachineIds] = useState<string[]>([]);
  const [comparedChemicalIds, setComparedChemicalIds] = useState<string[]>([]);

  // Simulator States
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  // Quiz States
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizSelectedMachineId, setQuizSelectedMachineId] = useState<string | null>(null);
  const [quizSelectedChemicalId, setQuizSelectedChemicalId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

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
    let isChemicalsLoadedFromSheet = false;

    // Helper to parse CSV
    const parseCSV = (text: string): Record<string, string>[] => {
      const lines: string[][] = [];
      let row: string[] = [''];
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            row[row.length - 1] += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push('');
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          lines.push(row);
          row = [''];
        } else {
          row[row.length - 1] += char;
        }
      }
      if (row.length > 1 || row[0] !== '') {
        lines.push(row);
      }

      if (lines.length === 0) return [];
      const headers = lines[0].map(h => h.trim());
      
      return lines.slice(1).map(rowValues => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = rowValues[index] ? rowValues[index].trim() : '';
        });
        return obj;
      });
    };

    const loadChemicalsFromSheet = async (url: string) => {
      try {
        console.log('Fetching chemicals from Google Sheet...', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const csvText = await res.text();
        const rows = parseCSV(csvText);
        
        const parsedChemicals: Chemical[] = rows.map((row) => {
          const safetyRaw = row.safetyMsds || row.safety_msds || row.msds || '';
          const safetyMsds = safetyRaw
            ? safetyRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];
          const pHRaw = row.pH || row.ph || '';
          const pH = pHRaw ? parseFloat(pHRaw) : undefined;
          
          return {
            id: row.id || '',
            name: row.name || '',
            type: row.type || '',
            image: row.image || '',
            desc: row.desc || row.description || '',
            pH: isNaN(pH as number) ? undefined : pH,
            dilutionRatio: row.dilutionRatio || row.dilution_ratio || row.ratio || undefined,
            safetyMsds: safetyMsds.length > 0 ? safetyMsds : undefined
          };
        }).filter((c) => c.id && c.name);

        if (parsedChemicals.length > 0 && isConnected) {
          console.log('Successfully loaded chemicals from Google Sheet:', parsedChemicals);
          setChemicals(parsedChemicals);
          isChemicalsLoadedFromSheet = true;
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to load chemicals from Google Sheet:', err);
        return false;
      }
    };

    // A timeout to detect offline/mock environment and switch to static fallback
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.warn('Firestore connection timeout. Switching to local static fallback.');
        setUseStaticFallback(true);
        setPackages(defaultPackages);
        setAreas(defaultAreas);
        setMachines(defaultMachines);
        if (!isChemicalsLoadedFromSheet) {
          setChemicals(defaultChemicals);
        }
        setTools(defaultTools);
        setMappings(defaultMappings);
        setLoading(false);
      }
    }, 4000); // 4 seconds timeout

    const initListeners = async () => {
      const sheetUrl = import.meta.env.VITE_CHEMICALS_SHEET_URL;
      if (sheetUrl) {
        const loaded = await loadChemicalsFromSheet(sheetUrl);
        if (loaded) {
          isChemicalsLoadedFromSheet = true;
        }
      }

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

        // Chemicals (only if NOT loaded from Google Sheet successfully)
        if (!isChemicalsLoadedFromSheet) {
          const unsubChemicals = onSnapshot(collection(db, 'chemicals'), 
            (snapshot) => {
              if (!isChemicalsLoadedFromSheet) {
                const list: Chemical[] = [];
                snapshot.forEach((doc) => list.push(doc.data() as Chemical));
                setChemicals(list.length > 0 ? list : defaultChemicals);
              }
            },
            (error) => console.error(error)
          );
          unsubscribes.push(unsubChemicals);
        }

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
        if (!isChemicalsLoadedFromSheet) {
          setChemicals(defaultChemicals);
        }
        setTools(defaultTools);
        setMappings(defaultMappings);
        setLoading(false);
        clearTimeout(fallbackTimer);
      }
    };

    initListeners();

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

      comparedMachineIds,
      setComparedMachineIds,
      comparedChemicalIds,
      setComparedChemicalIds,
      
      isSimulating,
      setIsSimulating,
      simStep,
      setSimStep,

      isQuizMode,
      setIsQuizMode,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      quizSelectedMachineId,
      setQuizSelectedMachineId,
      quizSelectedChemicalId,
      setQuizSelectedChemicalId,
      quizScore,
      setQuizScore,
      
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
