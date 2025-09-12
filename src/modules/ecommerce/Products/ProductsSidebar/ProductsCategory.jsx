import React from 'react';
// import TreeView from '@mui/lab/TreeView';
// import TreeItem from '@mui/lab/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Fonts } from '@crema/constants/AppEnums';

const ProductsCategory = () => {
  return (
    <TreeView
      style={{
        flexGrow: 1,
        maxWidth: 400,
        fontWeight: Fonts.REGULAR,
      }}
      defaultExpanded={['1']}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId='1' label='Tyres'>
        <TreeItem nodeId='2' label="Truck Tyres" />
        
      </TreeItem>
      <TreeItem nodeId='3' label='T-Shirts'>
        <TreeItem nodeId='4' label="Safety T-Shirts" />
        
      </TreeItem>
    </TreeView>
  );
};

export default ProductsCategory;
