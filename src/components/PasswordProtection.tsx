"use client";

import { useState } from "react";
import { Box, TextField, Button, Heading, Text } from "@radix-ui/themes";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({
  children,
}: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize state from sessionStorage during initial render
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("kerst_app_sofie_authenticated") === "true";
    }
    return false;
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword =
      process.env.NEXT_PUBLIC_APP_PASSWORD || "kerstmis2025";

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("kerst_app_sofie_authenticated", "true");
      setError("");
    } else {
      setError("Wachtwoord is incorrect. Probeer opnieuw.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        padding: "1rem",
      }}
    >
      <Box
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 16px -4px rgba(26, 77, 46, 0.1)",
          border: "2px solid rgba(26, 77, 46, 0.1)",
        }}
      >
        <Heading size="8" style={{ marginBottom: "1rem", textAlign: "center" }}>
          🎄
        </Heading>
        <Heading
          size="6"
          style={{ marginBottom: "0.5rem", textAlign: "center" }}
        >
          Wachtwoord vereist
        </Heading>
        <Text
          size="3"
          style={{
            marginBottom: "1.5rem",
            textAlign: "center",
            display: "block",
            color: "#666",
          }}
        >
          Voer het wachtwoord in om verder te gaan
        </Text>
        <form onSubmit={handleSubmit}>
          <TextField.Root
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            size="3"
            style={{ marginBottom: "1rem", width: "100%" }}
            autoFocus
          />
          {error && (
            <Text
              size="2"
              style={{
                color: "#c41e3a",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              {error}
            </Text>
          )}
          <Button type="submit" size="3" color="teal" style={{ width: "100%" }}>
            Toegang krijgen
          </Button>
        </form>
      </Box>
    </Box>
  );
}
