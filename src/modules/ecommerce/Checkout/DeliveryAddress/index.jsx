import React, { useState } from 'react';
import { 
  Box, Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, MenuItem, DialogContentText 
} from '@mui/material';
import AppList from '@crema/components/AppList';
import AddressCell from './AddressCell';
import { 
  useGetAddressesQuery, 
  useCreateAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation 
} from '@crema/Slices/addressSlice';

const AddressCrudPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const { data, isLoading, refetch } = useGetAddressesQuery({ page, limit });

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  const handleOpen = (address) => {
    setCurrentAddress(address || {
      fullName: '',
      email: '',
      confirmEmail: '',
      addressType: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phoneNumber: ''
    });
    setEditMode(!!address);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAddress(null);
  };

  const handleSave = async () => {
    if (editMode) {
      try {
        await updateAddress({ id: currentAddress.id, ...currentAddress });
        refetch();
      } catch (error) {
        console.error("Failed to update address:", error);
      }
    } else {
      try {
        await createAddress(currentAddress);
        refetch();
        console.log("Address created successfully");
      } catch (error) {
        console.error("Failed to create address:", error);
      }
    }
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await deleteAddress(deleteId); 
      setConfirmDeleteOpen(false); 
      refetch(); 
    } catch (error) {
      console.error("Failed to delete the address:", error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {data?.addresses?.length === 0 && (
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Address
        </Button>
      )}
      
      <AppList
        delay={200}
        data={data?.addresses || []}
        renderRow={(address) => (
          <AddressCell
            key={address.id}
            address={address}
            handleOpen={handleOpen}
          />
        )}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        <DialogContent>
          {/* ✅ New fields */}
          <TextField
            label="Full Name"
            value={currentAddress?.fullName || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, fullName: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            type="email"
            value={currentAddress?.email || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, email: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Confirm Email"
            type="email"
            value={currentAddress?.confirmEmail || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, confirmEmail: e.target.value })}
            fullWidth
            margin="dense"
          />

          {/* Existing fields */}
          <TextField
            select
            label="Address Type"
            value={currentAddress?.addressType || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, addressType: e.target.value })}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Shipping">Shipping</MenuItem>
            <MenuItem value="Billing">Billing</MenuItem>
          </TextField>
          <TextField
            label="Address Line 1"
            value={currentAddress?.addressLine1 || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, addressLine1: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address Line 2"
            value={currentAddress?.addressLine2 || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, addressLine2: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            value={currentAddress?.city || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="State"
            value={currentAddress?.state || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, state: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Postal Code"
            value={currentAddress?.postalCode || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, postalCode: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Country"
            value={currentAddress?.country || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, country: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone Number"
            value={currentAddress?.phoneNumber || ''}
            onChange={(e) => setCurrentAddress({ ...currentAddress, phoneNumber: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant='outlined'>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant='contained'>
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary" variant='outlined'>Cancel</Button>
          <Button onClick={handleDelete} color="primary" variant='contained'>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressCrudPage;
