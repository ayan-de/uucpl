"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    if (status === "loading") {
        return (
            <Box>
                <Skeleton variant="text" width={200} height={40} />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                            <Skeleton variant="rounded" height={120} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    const userName = session?.user?.name || "User";
    const userRole = session?.user?.role;

    return (
        <Box>
            {/* Error Alert */}
            {error === "unauthorized" && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    You don't have permission to access that page.
                </Alert>
            )}

            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Welcome back, {userName}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Here's an overview of your account activity.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        5
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Borrowers
                                    </Typography>
                                </Box>
                                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        ₹2.8L
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Pending
                                    </Typography>
                                </Box>
                                <PaymentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        3
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Overdue Payments
                                    </Typography>
                                </Box>
                                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            color: "white",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        12
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Reminders Sent
                                    </Typography>
                                </Box>
                                <NotificationsActiveIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Recent Activity
                </Typography>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {[
                                { action: "Payment reminder sent", borrower: "Rahul Sharma", time: "2 hours ago", type: "reminder" },
                                { action: "Payment received", borrower: "Sneha Gupta", time: "Yesterday", type: "payment" },
                                { action: "Overdue notice sent", borrower: "Amit Kumar", time: "2 days ago", type: "overdue" },
                            ].map((activity, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 1,
                                        borderBottom: index < 2 ? 1 : 0,
                                        borderColor: "divider",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>
                                            {activity.action}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {activity.borrower}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {activity.time}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
