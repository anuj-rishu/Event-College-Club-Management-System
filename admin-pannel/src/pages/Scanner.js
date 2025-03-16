import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from "../services/api";
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
  Switch,
  FormControlLabel,
  TextField
} from '@mui/material';
import { QrCode, Close } from '@mui/icons-material';

function Scanner() {
    const [scanHistory, setScanHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usePhysicalScanner, setUsePhysicalScanner] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const audioRef = useRef(new Audio('https://res.cloudinary.com/dtberehdy/video/upload/v1731606266/message-13716_ertk9q.mp3'));
    const scannerRef = useRef(null);
    const inputRef = useRef(null);

    const processQRCode = async (data) => {
        try {
            audioRef.current.play().catch(console.error);
            setLoading(true);
            setError(null);
            console.log("Scanned Data:", data);
            
            const response = await axios.post('/api/users/scan', { data });
            
            if (response.status === 200) {
                setScanHistory(prev => [{
                    ...response.data,
                    timestamp: new Date().toLocaleString()
                }, ...prev]);
                setError({ severity: 'success', message: 'QR Code scanned successfully!' });
            }
        } catch (error) {
            console.error('Scanning error:', error);
            setError({
                severity: 'error',
                message: error.response?.data?.message || 'Failed to scan QR code'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!usePhysicalScanner && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner('reader', {
                qrbox: { width: 300, height: 300 },
                fps: 5,
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
            });

            scannerRef.current.render(
                (result) => processQRCode(result),
                (err) => {
                    console.warn(err);
                    setError({
                        severity: 'error',
                        message: err.toString()
                    });
                }
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [usePhysicalScanner]);

    useEffect(() => {
        if (usePhysicalScanner && inputRef.current) {
            inputRef.current.focus();
        }
    }, [usePhysicalScanner]);

    const handlePhysicalScannerInput = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await processQRCode(manualInput);
            setManualInput('');
        }
    };

    const clearError = () => setError(null);

    const formatScanResult = (result) => {
        try {
            const data = typeof result === 'string' ? JSON.parse(result) : result;
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
        <Container maxWidth="md" className="min-h-screen py-8 mt-14 md:mt-0">
            <Paper elevation={3} className="p-6">
                <Box className="flex flex-col items-center gap-6">
                    <Typography variant="h4" className="flex items-center gap-2">
                        <QrCode color="primary" />
                        QR Code Scanner
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={usePhysicalScanner}
                                onChange={(e) => setUsePhysicalScanner(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Use Physical Scanner"
                    />

                    {usePhysicalScanner ? (
                        <TextField
                            inputRef={inputRef}
                            fullWidth
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyPress={handlePhysicalScannerInput}
                            placeholder="Scan or type QR code here..."
                            variant="outlined"
                            autoFocus
                        />
                    ) : (
                        <div className="w-full max-w-md">
                            <div id="reader" className="rounded-lg overflow-hidden shadow-lg" />
                        </div>
                    )}

                    {loading && (
                        <Box className="flex justify-center p-4">
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert 
                            severity={error.severity || 'error'}
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
                                        <ListItem>
                                            {formatScanResult(result)}
                                        </ListItem>
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

export default Scanner;