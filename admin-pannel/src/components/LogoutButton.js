import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  CircularProgress
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

function LogoutButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    // Remove the token from localStorage
    localStorage.removeItem("token");
    
    // Add small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Redirect to the login page after logout
    navigate("/login");
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpen}
        startIcon={<LogoutIcon />}
        className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
        size="medium"
        disableElevation
      >
        Logout
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={handleClose}
            variant="outlined"
            className="hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700"
            autoFocus
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LogoutButton;