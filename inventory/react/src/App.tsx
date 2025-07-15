import { useState } from 'react';
import { InventoryExample } from './InventoryExample';
import { TreeViewPage } from './TreeViewPage';
import styles from './InventoryExample.module.css';

export function App() {
  const [currentPage, setCurrentPage] = useState<'inventory' | 'treeview'>('inventory');

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.exampleHeader}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentPage('inventory')}
              style={{
                padding: '10px 20px',
                backgroundColor: currentPage === 'inventory' ? '#00BFFF' : '#f0f0f0',
                color: currentPage === 'inventory' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Inventory Example
            </button>
            <button
              onClick={() => setCurrentPage('treeview')}
              style={{
                padding: '10px 20px',
                backgroundColor: currentPage === 'treeview' ? '#00BFFF' : '#f0f0f0',
                color: currentPage === 'treeview' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Tree View Grid
            </button>
          </div>
        </div>

        {currentPage === 'inventory' ? <InventoryExample /> : <TreeViewPage />}
      </div>
    </div>
  );
} 