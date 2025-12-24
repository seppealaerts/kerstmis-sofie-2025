"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Heading, Text } from "@radix-ui/themes";
import { useSlideNavigation } from "@/contexts/SlideNavigationContext";

interface PasswordSlideProps {
  passwordKey: string; // Unique key for this password slide (e.g., "password1", "password2")
  correctPassword?: string; // Optional custom password, defaults to env variable
}

export default function PasswordSlide({
  passwordKey,
  correctPassword,
}: PasswordSlideProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize authentication state synchronously if possible
    if (typeof window !== "undefined") {
      const authKey = `kerst_app_sofie_authenticated_${passwordKey}`;
      return sessionStorage.getItem(authKey) === "true";
    }
    return false;
  });
  const [error, setError] = useState("");
  const { setCanGoNext } = useSlideNavigation();

  useEffect(() => {
    // Set navigation state based on authentication
    setCanGoNext(isAuthenticated);
  }, [isAuthenticated, setCanGoNext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPwd =
      correctPassword || process.env.NEXT_PUBLIC_APP_PASSWORD || "kerstmis2025";

    if (password === correctPwd) {
      setIsAuthenticated(true);
      const authKey = `kerst_app_sofie_authenticated_${passwordKey}`;
      sessionStorage.setItem(authKey, "true");
      setCanGoNext(true);
      setError("");
    } else {
      setError("Wachtwoord is incorrect. Probeer opnieuw.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return (
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <Box style={{ textAlign: "center" }}>
          <Heading size="7" style={{ marginBottom: "1rem" }}>
            ✅ Toegang verkregen!
          </Heading>
          <Text size="4">Je kunt nu verder gaan naar de volgende slide.</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
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
          boxShadow: "0 8px 16px -4px rgba(15, 118, 110, 0.1)",
          border: "2px solid rgba(15, 118, 110, 0.1)",
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
