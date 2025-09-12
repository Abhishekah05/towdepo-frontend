import AppCard from '@crema/components/AppCard';
import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import AppGridContainer from '@crema/components/AppGridContainer';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';


const statusList = [
  {
    id: 1,
    name: 'In Stock',
    value: true,
  },
  {
    id: 2,
    name: 'Out of Stock',
    value: false,
  },
  {
    id: 3,
    name: 'All',
    value: true,
  },

];

const FilterItem = ({ filterData, setFilterData }) => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const inputLabel = React.useRef(null);

  useEffect(() => {
    setFilterData({
      title: searchParams.get('title') || '',
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : null,
      mrp: {
        start: Number(searchParams.get('mrpStart')) || 0,
        end: Number(searchParams.get('mrpEnd')) || 30000,
      },
    });
  }, []);
  const updateFilters = (newFilters) => {
    setFilterData(newFilters);
    setSearchParams({
      title: newFilters.title,
      inStock: newFilters.inStock,
      mrpStart: newFilters.mrp.start,
      mrpEnd: newFilters.mrp.end,
    });
  };
  

  return (
    <AppCard title='Filter Item'>
      <AppGridContainer spacing={5}>
        <Grid item xs={12}>
          <FormControl
            sx={{
              width: '100%',
            }}
            variant='outlined'
          >
            <InputLabel ref={inputLabel} id='demo-simple-select-outlined-label'>
              Status
            </InputLabel>
            <Select
              label="status"
              name="status"
              value={
                filterData.inStock === null ? 3 : filterData.inStock ? 1 : 2
              } // Show correct selection
              onChange={(e) => {
                setFilterData((prev) => ({
                  ...prev,
                  inStock: e.target.value === 3 ? null : e.target.value === 1,
                  // `null` means "All", `true` for "In Stock", `false` for "Out of Stock"
                }));
              }}
            >
              {statusList.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>



          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type='number'
            onChange={(e) => {
              const value = Math.max(0, +e.target.value); // Prevent negative values
              setFilterData((prev) => ({
                ...prev,
                mrp: { start: value, end: prev.mrp.end },
              }));
            }}
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
            variant='outlined'
            label='Start Price'
            inputProps={{ min: 0 }} // Restricts manual entry of negative values
          />

        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type='number'
            onChange={(e) => {
              const value = Math.max(0, +e.target.value);
              setFilterData((prev) => ({
                ...prev,
                mrp: { start: filterData.mrp.start, end: +e.target.value },
              }));
            }}
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
            variant='outlined'
            label='End Price'
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            label='Creation Start Date'
            value={filterData?.createdAt?.start}
            renderInput={(params) => <TextField {...params} />}
            onChange={(value) =>
              setFilterData((prev) => ({
                ...prev,
                createdAt: {
                  start: dayjs(value).format('DD MMM YYYY'),
                  end: filterData?.createdAt?.end,
                },
              }))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatePicker
            label='Creation End Date'
            value={filterData?.createdAt?.end}
            renderInput={(params) => <TextField {...params} />}
            onChange={(value) =>
              setFilterData((prev) => ({
                ...prev,
                createdAt: {
                  start: filterData?.createdAt?.start,
                  end: dayjs(value).format('DD MMM YYYY'),
                },
              }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Switch
            value='checkedA'
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <Box component='span'>Notifications</Box>
        </Grid>
      </AppGridContainer>
    </AppCard>
  );
};

export default FilterItem;

FilterItem.propTypes = {
  filterData: PropTypes.object.isRequired,
  setFilterData: PropTypes.func.isRequired,
};
