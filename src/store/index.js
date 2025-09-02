import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

const store = createStore(
  persist(
    set => {
      return {
        locale: 'tr',
        employees: [],
        selectedItems: [],
        tempDeletableItem: null,
        changeLocale: locale => set({ locale }),
        setItemToDelete: item => set({ tempDeletableItem: item }),
        setSelectedItems: selectedItems => set({ selectedItems }),
        clearSelectedItems: () => set({ selectedItems: [] }),
        addSelectedItem: item => set(state => ({ selectedItems: [...state.selectedItems, item] })),
        removeSelectedItem: item =>
          set(state => ({ selectedItems: state.selectedItems.filter(i => i.id !== item.id) })),
        setEmployees: employees => set({ employees }),
        addEmployee: employee => set(state => ({ employees: [...state.employees, employee] })),
        deleteEmployee: id =>
          set(state => ({ employees: state.employees.filter(emp => emp.id !== id) })),
        updateEmployeeById: (id, updatedData) =>
          set(state => ({
            employees: state.employees.map(emp =>
              emp.id === id ? { ...emp, ...updatedData } : emp
            ),
          })),
        findEmployeeById: id => {
          const employees = store.getState().employees;
          return employees.find(emp => emp.id === id);
        },
        findEmployeeByEmail: email => {
          const employees = store.getState().employees;
          return employees.find(emp => emp.email === email);
        },
        findEmployeeByPhone: phone => {
          const employees = store.getState().employees;
          return employees.find(emp => emp.phone === phone);
        },
      };
    },
    {
      name: 'employee-storage',
      partialize: state => ({ locale: state.locale, employees: state.employees }),
    }
  )
);

export default store;
