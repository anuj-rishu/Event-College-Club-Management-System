"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import html2canvas from "html2canvas";

export default function EventRegistration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ticketRef = useRef(null);

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://localhost:9000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "event-ticket.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Event Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 text-gray-100 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 text-gray-100 border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {qrCode && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Registration Successful
              </h2>
              <Card
                ref={ticketRef}
                className="bg-gray-700 p-4 rounded-lg shadow-lg transform rotate-3"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-sm text-gray-400">{email}</p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Scan this QR code for event entry
                </div>
              </Card>
              <Button onClick={downloadTicket} className="mt-4 w-full">
                <Download className="mr-2 h-4 w-4" /> Download Ticket
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
