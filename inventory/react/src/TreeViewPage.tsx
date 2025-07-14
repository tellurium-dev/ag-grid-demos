import React from 'react';
import { TreeViewGrid } from './TreeViewGrid';
import styles from './InventoryExample.module.css';

export function TreeViewPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.exampleHeader}>
          <h2>Tree View Grid</h2>
          <p>A hierarchical tree view with editable cells and expand/collapse functionality</p>
        </div>
        <div style={{ padding: '20px' }}>
          <TreeViewGrid />
        </div>
      </div>
    </div>
  );
} 