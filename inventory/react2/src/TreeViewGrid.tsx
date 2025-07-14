import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { getData } from './data';

// Register the TreeDataModule
ModuleRegistry.registerModules([TreeDataModule]);

export function TreeViewGrid() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const gridRef = React.useRef<AgGridReact>(null);

  // Transform the data to work with AG Grid's tree data
  const treeData = useMemo(() => {
    const rawData = getData();

    // Create a map to track unique paths and their data
    const pathMap = new Map<string, any>();

    rawData.forEach((item) => {
      const path = item.path;
      let currentPath = '';

      // Build the tree structure
      path.forEach((segment: string, index: number) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (!pathMap.has(currentPath)) {
          const nodeData: any = {
            name: segment,
            level: index,
            path: currentPath,
          };

          // Add the original data to leaf nodes
          if (index === path.length - 1) {
            nodeData.col1 = item.col1;
            nodeData.col2 = item.col2;
            if ('modified' in item && item.modified) {
              nodeData.modified = item.modified;
            }
          }

          pathMap.set(currentPath, nodeData);
        }
      });
    });

    // Convert map to array and sort by path
    return Array.from(pathMap.values()).sort((a, b) => a.path.localeCompare(b.path));
  }, []);

  // Function to check if a cell is editable
  const isEditableCell = (params: any) => {
    const path = params.data.path;
    const field = params.colDef.field;

    // Only Machine Type col2 is editable
    if (path === 'Machine Type' && field === 'col2') {
      return true;
    }
    if (path === 'Machine Type' && field === 'col1') {
      return true;
    }

    return false;
  };

  // Function to get cell class for highlighting
  const getCellClass = (params: any) => {
    const path = params.data.path;
    const field = params.colDef.field;
    const level = params.data.level;

    // Add left border to parent rows in Name column
    if (level === 0 && field === 'name') {
      console.log('Applying parent-name-cell to:', { path, field, level });
      return 'parent-name-cell';
    }

    // Check if this is an editable cell
    const isEditable = isEditableCell(params);
    if (isEditable) {
      return 'editable-cell';
    }

    return '';
  };

  // Column definitions for the tree grid
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'col1',
      headerName: 'Column 1',
      flex: 1,
      editable: isEditableCell,
      cellClass: getCellClass,
      valueFormatter: (params) => {
        if (params.value === undefined || params.value === null) return '';
        return params.value.toString();
      },
    },
    {
      field: 'col2',
      headerName: 'Column 2',
      flex: 1,
      editable: isEditableCell,
      cellClass: getCellClass,
      valueFormatter: (params) => {
        if (params.value === undefined || params.value === null) return '';
        return params.value.toString();
      },
    },

  ], []);

  // Auto group column definition to make tree column span full width
  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Name',
    minWidth: 300,
    flex: 2,
    cellClass: getCellClass,
    cellStyle: (params: any) => {
      const level = params.data.level;
      if (level === 0) {
        return {
          borderLeft: '4px solid #00BFFF',
          paddingLeft: '12px',

        };
      }
      return null;
    },
    cellRendererParams: {
      suppressCount: true,
      suppressDoubleClickExpand: true,
    },
  }), []);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Tree data configuration
  const treeDataConfig = useMemo(() => ({
    getDataPath: (data: any) => {
      // Split the path string back into an array for AG Grid
      return data.path.split('/');
    },
    groupDefaultExpanded: isExpanded ? -1 : 0, // Expand all groups based on checkbox state
  }), [isExpanded]);

  // Function to handle expand/collapse all
  const handleExpandCollapse = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (gridRef.current && gridRef.current.api) {
      if (expanded) {
        gridRef.current.api.expandAll();
      } else {
        gridRef.current.api.collapseAll();
      }
    }
  };

  return (
    <div style={{ height: 500, width: '100%', }}>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isExpanded}
            onChange={(e) => handleExpandCollapse(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {isExpanded ? 'Collapse All' : 'Expand All'}
          </span>
        </label>
      </div>
      <style>
        {`
          .ag-theme-balham .ag-header-cell {
            border-right: 1px solid #c8c6c4;
          }
          .ag-theme-balham .ag-cell {
            border-right: 1px solid #c8c6c4;
          }
          .ag-theme-balham .ag-header-cell:last-child,
          .ag-theme-balham .ag-cell:last-child {
            border-right: none;
          }
          .ag-theme-balham .editable-cell {
            background: repeating-linear-gradient(
              45deg,
              #f8fdff 0px,
              #f8fdff 4px,
              #f0fbff 4px,
rgb(217, 235, 245) 8px
            ) !important;
            border: 2px solid #00BFFF !important;
            border-radius: 6px;
            box-shadow: inset 0 1px 3px rgba(0, 191, 255, 0.15);
          }
          .ag-theme-balham .editable-cell:hover {
            background: repeating-linear-gradient(
              45deg,
              #f0fbff 0px,
              #f0fbff 4px,
              #e6f7ff 4px,
rgb(217, 235, 245) 8px
            ) !important;
            border: 2px solid #0099cc !important;
            border-radius: 6px;
            box-shadow: inset 0 1px 4px rgba(0, 191, 255, 0.2), 0 2px 6px rgba(0, 191, 255, 0.15);
          }
          .ag-theme-balham .editable-cell.ag-cell-edit-input {
            background: #ffffff !important;
            border: 2px solid #00BFFF !important;
            border-radius: 6px;
            box-shadow: 0 0 0 3px rgba(213, 237, 245, 0.2), 0 3px 8px rgba(0, 0, 0, 0.15);
          }
          .ag-theme-balham .ag-cell.parent-name-cell {
            border-left: 8px solid #d3d3d3 !important;
            padding-left: 12px !important;
            
            position: relative !important;
          }
          .ag-theme-balham .ag-cell.parent-name-cell::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 8px;
            background: #d3d3d3;
            z-index: 10;
          }
          .ag-theme-balham .ag-cell.parent-name-cell:hover {
            border-left: 8px solid #b0b0b0 !important;
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
      <div className="ag-theme-balham" style={{ height: '100%', width: '70%' }}>
        <AgGridReact
          ref={gridRef}
          theme={'legacy'}
          rowData={treeData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          treeData={true}
          getDataPath={treeDataConfig.getDataPath}
          groupDefaultExpanded={treeDataConfig.groupDefaultExpanded}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          detailRowAutoHeight
          domLayout="autoHeight"
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </div>
  );
} 