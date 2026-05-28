import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Machine, Chemical, Tool, Area, Package, MappingRecord } from '../types';

// ==========================================
// 1. SERVICES FOR MACHINES (Thiết bị)
// ==========================================
export const addMachine = async (machine: Omit<Machine, 'id'> & { id?: string }) => {
  const machineCollection = collection(db, 'machines');
  if (machine.id) {
    const docRef = doc(machineCollection, machine.id);
    await setDoc(docRef, { ...machine, id: machine.id });
    return machine.id;
  } else {
    const docRef = await addDoc(machineCollection, machine);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updateMachine = async (id: string, data: Partial<Machine>) => {
  const docRef = doc(db, 'machines', id);
  await updateDoc(docRef, data);
};

export const deleteMachine = async (id: string) => {
  const docRef = doc(db, 'machines', id);
  await deleteDoc(docRef);
};

// ==========================================
// 2. SERVICES FOR CHEMICALS (Hóa chất)
// ==========================================
export const addChemical = async (chemical: Omit<Chemical, 'id'> & { id?: string }) => {
  const chemicalCollection = collection(db, 'chemicals');
  if (chemical.id) {
    const docRef = doc(chemicalCollection, chemical.id);
    await setDoc(docRef, { ...chemical, id: chemical.id });
    return chemical.id;
  } else {
    const docRef = await addDoc(chemicalCollection, chemical);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updateChemical = async (id: string, data: Partial<Chemical>) => {
  const docRef = doc(db, 'chemicals', id);
  await updateDoc(docRef, data);
};

export const deleteChemical = async (id: string) => {
  const docRef = doc(db, 'chemicals', id);
  await deleteDoc(docRef);
};

// ==========================================
// 3. SERVICES FOR TOOLS (Dụng cụ)
// ==========================================
export const addTool = async (tool: Omit<Tool, 'id'> & { id?: string }) => {
  const toolCollection = collection(db, 'tools');
  if (tool.id) {
    const docRef = doc(toolCollection, tool.id);
    await setDoc(docRef, { ...tool, id: tool.id });
    return tool.id;
  } else {
    const docRef = await addDoc(toolCollection, tool);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updateTool = async (id: string, data: Partial<Tool>) => {
  const docRef = doc(db, 'tools', id);
  await updateDoc(docRef, data);
};

export const deleteTool = async (id: string) => {
  const docRef = doc(db, 'tools', id);
  await deleteDoc(docRef);
};

// ==========================================
// 4. SERVICES FOR AREAS (Khu vực)
// ==========================================
export const addArea = async (area: Omit<Area, 'id'> & { id?: string }) => {
  const areaCollection = collection(db, 'areas');
  if (area.id) {
    const docRef = doc(areaCollection, area.id);
    await setDoc(docRef, { ...area, id: area.id });
    return area.id;
  } else {
    const docRef = await addDoc(areaCollection, area);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updateArea = async (id: string, data: Partial<Area>) => {
  const docRef = doc(db, 'areas', id);
  await updateDoc(docRef, data);
};

export const deleteArea = async (id: string) => {
  const docRef = doc(db, 'areas', id);
  await deleteDoc(docRef);
};

// ==========================================
// 5. SERVICES FOR PACKAGES (Gói dịch vụ)
// ==========================================
export const addPackage = async (pkg: Omit<Package, 'id'> & { id?: string }) => {
  const packageCollection = collection(db, 'packages');
  if (pkg.id) {
    const docRef = doc(packageCollection, pkg.id);
    await setDoc(docRef, { ...pkg, id: pkg.id });
    return pkg.id;
  } else {
    const docRef = await addDoc(packageCollection, pkg);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updatePackage = async (id: string, data: Partial<Package>) => {
  const docRef = doc(db, 'packages', id);
  await updateDoc(docRef, data);
};

export const deletePackage = async (id: string) => {
  const docRef = doc(db, 'packages', id);
  await deleteDoc(docRef);
};

// ==========================================
// 6. SERVICES FOR MAPPINGS (Quy trình liên kết chéo)
// ==========================================
export const addMapping = async (mapping: Omit<MappingRecord, 'id'> & { id?: string }) => {
  const mappingCollection = collection(db, 'mappings');
  if (mapping.id) {
    const docRef = doc(mappingCollection, mapping.id);
    await setDoc(docRef, { ...mapping, id: mapping.id });
    return mapping.id;
  } else {
    const docRef = await addDoc(mappingCollection, mapping);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }
};

export const updateMapping = async (id: string, data: Partial<MappingRecord>) => {
  const docRef = doc(db, 'mappings', id);
  await updateDoc(docRef, data);
};

export const deleteMapping = async (id: string) => {
  const docRef = doc(db, 'mappings', id);
  await deleteDoc(docRef);
};
