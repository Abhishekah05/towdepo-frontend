import React, { useEffect, useState } from "react";
import AppsContainer from "@crema/components/AppsContainer";
import { useIntl } from "react-intl";
import {
  Hidden,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import AppsHeader from "@crema/components/AppsContainer/AppsHeader";
import AppsContent from "@crema/components/AppsContainer/AppsContent";
import AppsPagination from "@crema/components/AppsPagination";

import AppSearchBar from "@crema/components/AppSearchBar";
import OrderTable from "./OrderTable";
import  { useAuthUser } from '../../../@crema/hooks/AuthHooks'
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useCancelOrderMutation,
} from "@crema/Slices/orderSlice";

import { useGetCancellationReasonsQuery } from "../../../@crema/Slices/cancellationReasonApiSlice";

const Orders = () => {
  const { messages } = useIntl();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dialogAction, setDialogAction] = useState("delete"); // 'delete' or 'cancel'
  const itemsPerPage = 10;
  const { user } = useAuthUser();
  console.log("User:", user);
  // Cancellation reason states
  const [cancelReason, setCancelReason] = useState("");
  const [comments, setComments] = useState("");

  // Fetch cancellation reasons only when needed
  const [fetchReasons, setFetchReasons] = useState(false);

  // Fetch orders with search filter
  const { data, error, isLoading, refetch } = useGetOrdersQuery({
    page,
    limit: itemsPerPage,
    search: searchQuery,
  });

  // Fetch cancellation reasons (only when needed)
  const { data: reasonsData, isLoading: reasonsLoading } =
    useGetCancellationReasonsQuery(
      { limit: 100 }, // Get all active reasons
      { skip: !fetchReasons } // Only fetch when needed
    );

  const [deleteOrder] = useDeleteOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const onSearchOrder = (query) => {
    setSearchQuery(query.trim().toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  const handleClickOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setDialogAction("delete");
    setOpen(true);
  };

  const handleCancelOrder = (orderId, orderStatus) => {
    if (orderStatus === "Pending") {
      setSelectedOrderId(orderId);
      setDialogAction("cancel");
      // Reset cancel reason and comments when opening dialog
      setCancelReason("");
      setComments("");
      // Trigger fetching of cancellation reasons
      setFetchReasons(true);
      setOpen(true);
    } else {
      setSnackbarMessage("You cannot cancel the order in this status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
  };

  const handleReasonChange = (event) => {
    setCancelReason(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleConfirmAction = async () => {
    try {
      if (dialogAction === "delete") {
        await deleteOrder(selectedOrderId).unwrap();
        setSnackbarMessage("Order Deleted Successfully");
      } else if (dialogAction === "cancel") {
        // Prepare cancellation data
        const cancellationInfo = {
          reason: cancelReason,
          comments: comments.trim(),
        };

        // Send cancellation with reason and comments
        await cancelOrder({
          id: selectedOrderId,
          cancellationInfo: cancellationInfo,
        }).unwrap();

        setSnackbarMessage("Order Cancelled Successfully");
      }

      // Refresh the data to show updated status
      await refetch();

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Failed to ${dialogAction} the order:`, error);
      setSnackbarMessage(
        `Failed to ${dialogAction} the order: ${error.data?.message || "Unknown error"}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      handleClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Process orders data to ensure UI matches latest status
 const processOrderData = () => {
  if (!data?.orders) return [];

  return data.orders.filter((order) => {
    // Only include orders of the logged-in user
    if (order.userId?.id !== user.id) return false;

    // Apply search filter
    return (
      String(order.userId?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(order.orderNumber || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(order.orderStatus || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(order.totalAmount || "").includes(searchQuery)
    );
  });
};


  if (isLoading) return <>Loading...</>;

  return (
    <AppsContainer title={messages["eCommerce.recentOrders"]} fullView>
      <AppsHeader>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          width={1}
          justifyContent="space-between"
        >
          <AppSearchBar
            iconPosition="right"
            overlap={false}
            onChange={(event) => onSearchOrder(event.target.value)}
            placeholder={messages["common.searchHere"]}
          />
          <Box display="flex" flexDirection="row" alignItems="center">
            <Hidden smDown>
              <AppsPagination
                rowsPerPage={10}
                count={data?.totalResults}
                page={page}
                onPageChange={onPageChange}
                sx={{
                  ".MuiTablePagination-toolbar": {
                    display: "flex",
                    justifyContent: "end",
                    padding: "0.5rem",
                  },
                  ".MuiTablePagination-spacer": {
                    flex: "none",
                  },
                  ".MuiTablePagination-selectLabel": {
                    pt: 8,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-displayedRows": {
                    pt: 8,
                    fontSize: "12px",
                    color: "#535c69",
                  },
                  ".MuiTablePagination-actions": {
                    alignItems: "center",
                  },
                }}
              />
            </Hidden>
          </Box>
        </Box>
      </AppsHeader>

      <AppsContent sx={{ paddingTop: 2.5, paddingBottom: 2.5 }}>
        <OrderTable
          orderData={processOrderData()}
          onDeleteOrder={handleClickOpen}
          onCancelOrder={handleCancelOrder}
          loading={isLoading}
        />
      </AppsContent>

      <Hidden smUp>
        <AppsPagination
          rowsPerPage={10}
          count={data?.totalResults}
          page={page}
          onPageChange={onPageChange}
        />
      </Hidden>

      {/* Enhanced Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "8px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
            width: "600px",  // Set a specific width
            maxWidth: "90vw" // Ensure it doesn't overflow on smaller screens
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "17px", fontWeight: 500, py: 2 }}>
          {dialogAction === "delete"
            ? "Confirm Delete"
            : "Confirm Cancellation ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "primary",
              mb: dialogAction === "cancel" ? 2 : 0,
            }}
          >
            {dialogAction === "delete"
              ? "Are you sure you want to delete this order? This action cannot be undone."
              : ""}
          </DialogContentText>
          {/* Cancellation Reason Form with Dropdown */}
          {dialogAction === "cancel" && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth required sx={{ mb: 3 }}>
                <InputLabel id="reason-select-label">
                  Reason for Cancellation
                </InputLabel>
                <Select
                  labelId="reason-select-label"
                  id="reason-select"
                  value={cancelReason}
                  label="Reason for Cancellation *"
                  onChange={handleReasonChange}
                  disabled={reasonsLoading}
                >
                  <MenuItem value="">Select Reason</MenuItem>
                  {reasonsLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center">
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading reasons...
                      </Box>
                    </MenuItem>
                  ) : (
                    reasonsData?.data?.results?.map((reasonItem) => (
                      <MenuItem key={reasonItem.id} value={reasonItem.reason}>
                        {reasonItem.reason}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth required sx={{ mb: 1 }}>
                <TextField
                  label="Comments *"
                  variant="outlined"
                  size="medium"
                  fullWidth
                  multiline
                  rows={3}
                  value={comments}
                  onChange={handleCommentsChange}
                  placeholder="Please provide additional details about your cancellation"
                />
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1 ,paddingRight:"25px" , mb:3 }}>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            {messages["common.cancel"]}
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={dialogAction === "delete" ? "primary" : "primary"}
            variant="contained"
            sx={{ borderRadius: "8px", textTransform: "none" }}
            disabled={
              dialogAction === "cancel" &&
              (!cancelReason || !comments.trim() || reasonsLoading)
            }
          >
            {dialogAction === "delete"
              ? messages["common.delete"]
              : "Confirm Cancel"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}

      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="outlined"
          sx={{
            width: "100%",
            backgroundColor: "#43a047", // Custom background color
            color: "white",
            fontWeight: "bold",
            "& .MuiSvgIcon-root": { color: "white" },
            padding: "2px 10px", 
            minHeight: "28px", 
            display: "flex",
            alignItems: "center", 
            justifyContent: "center", 
        }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppsContainer>
  );
};

export default Orders;
