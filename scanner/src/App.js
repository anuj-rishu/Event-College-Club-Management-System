import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { QrCode, Close } from "@mui/icons-material";

function App() {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(
    new Audio(
      "https://res.cloudinary.com/dtberehdy/video/upload/v1731606266/message-13716_ertk9q.mp3"
    )
  );
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 300,
          height: 300,
        },
        fps: 5,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      });

      const success = async (result) => {
        try {
          audioRef.current.play().catch(console.error);

          setLoading(true);
          setError(null);
          console.log("Scanned Data:", result);

          const response = await axios.post(
            "http://localhost:9000/api/users/scan",
            {
              data: result,
            }
          );

          if (response.status === 200) {
            setScanHistory((prev) => [
              {
                ...response.data,
                timestamp: new Date().toLocaleString(),
              },
              ...prev,
            ]);

            // Show success message
            setError({
              severity: "success",
              message: "QR Code scanned successfully!",
            });
          }
        } catch (error) {
          console.error("Scanning error:", error);
          setError({
            severity: "error",
            message: error.response?.data?.message || "Failed to scan QR code",
          });
        } finally {
          setLoading(false);
        }
      };

      const error = (err) => {
        console.warn(err);
        setError({
          severity: "error",
          message: err.toString(),
        });
      };

      scannerRef.current.render(success, error);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const formatScanResult = (result) => {
    try {
      const data = typeof result === "string" ? JSON.parse(result) : result;
      return (
        <Box>
          <Typography variant="subtitle2">Name: {data.name}</Typography>
          <Typography variant="subtitle2">Email: {data.email}</Typography>
          <Typography variant="caption" color="textSecondary">
            Scanned at: {data.timestamp}
          </Typography>
        </Box>
      );
    } catch (e) {
      return <Typography>{String(result)}</Typography>;
    }
  };

  return (
    <Container maxWidth="md" className="min-h-screen py-8">
      <Paper elevation={3} className="p-6">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h4" className="flex items-center gap-2">
            <QrCode color="primary" />
            QR Code Scanner
          </Typography>

          <div className="w-full max-w-md">
            <div id="reader" className="rounded-lg overflow-hidden shadow-lg" />
          </div>

          {loading && (
            <Box className="flex justify-center p-4">
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert
              severity={error.severity || "error"}
              className="w-full"
              action={
                <IconButton size="small" onClick={clearError}>
                  <Close />
                </IconButton>
              }
            >
              {error.message}
            </Alert>
          )}

          {scanHistory.length > 0 && (
            <Paper className="w-full p-4 bg-gray-50">
              <Typography variant="h6" className="mb-2">
                Scan History ({scanHistory.length})
              </Typography>
              <List>
                {scanHistory.map((result, index) => (
                  <React.Fragment key={index}>
                    <ListItem>{formatScanResult(result)}</ListItem>
                    {index < scanHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
