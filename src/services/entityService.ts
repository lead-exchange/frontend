import type { Entity, Lead, Object } from '@/types/entity';

// Mock data service - заглушка для получения данных с бэкенда
export const fetchEntities = async (): Promise<Entity[]> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Возвращаем mock данные
  return [
    { id: 1, name: 'Entity One' },
    { id: 2, name: 'Entity Two' },
    { id: 3, name: 'Entity Three' },
    { id: 4, name: 'Entity Four' },
    { id: 5, name: 'Entity Five' },
  ];
};

export const fetchLeads = async (): Promise<Lead[]> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Возвращаем mock данные для лидов
  return [
    { id: 1, name: 'Лид 1', type: 'lead' },
    { id: 2, name: 'Лид 2', type: 'lead' },
    { id: 3, name: 'Лид 3', type: 'lead' },
    { id: 4, name: 'Лид 4', type: 'lead' },
    { id: 5, name: 'Лид 5', type: 'lead' },
  ];
};

export const fetchObjects = async (): Promise<Object[]> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Возвращаем mock данные для объектов
  return [
    { id: 1, name: 'Объект 1', type: 'object' },
    { id: 2, name: 'Объект 2', type: 'object' },
    { id: 3, name: 'Объект 3', type: 'object' },
    { id: 4, name: 'Объект 4', type: 'object' },
  ];
};