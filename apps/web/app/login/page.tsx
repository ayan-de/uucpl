"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        error === "CredentialsSignin" ? "Invalid email or password" : null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setErrorMessage(result.error === "CredentialsSignin"
                    ? "Invalid email or password"
                    : result.error
                );
                setIsLoading(false);
                return;
            }

            // Successful login - fetch session to determine redirect based on role
            const response = await fetch("/api/auth/session");
            const session = await response.json();

            // Determine redirect URL based on role
            let redirectUrl = callbackUrl;
            if (session?.user?.role === "ADMIN") {
                // Admin users go to /admin unless they have a specific callbackUrl
                redirectUrl = callbackUrl === "/dashboard" ? "/admin" : callbackUrl;
            }

            router.push(redirectUrl);
            router.refresh();
        } catch (error) {
            setErrorMessage("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                padding: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 420,
                    width: "100%",
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Logo/Header */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1,
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: "white",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.2)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.4)",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#667eea",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { color: "rgba(255,255,255,0.6)" },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: "rgba(255,255,255,0.5)" }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    color: "white",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.2)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.4)",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#667eea",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { color: "rgba(255,255,255,0.6)" },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #5a6fd6 0%, #6a4190 100%)",
                                },
                                "&:disabled": {
                                    background: "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Demo Credentials Info */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(102, 126, 234, 0.1)",
                            border: "1px solid rgba(102, 126, 234, 0.3)",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.7)", display: "block", mb: 1 }}
                        >
                            Demo Credentials:
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.5)", display: "block" }}
                        >
                            Admin: admin@uucpl.com / admin123
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.5)", display: "block" }}
                        >
                            Client: client1@uucpl.com / client123
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
