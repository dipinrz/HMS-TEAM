import { Typography, Box, LinearProgress } from "@mui/material";
import { Card, CardContent, CardHeader } from "../ui/CustomCards";

export default function SystemStatusCard() {
  return (
    <Box>
      <Card sx={{ width: "100%" }} elevation={1}>
        <CardHeader
          title="System Status"
          subheader="Real-time system health and performance metrics"
        />
        <CardContent>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
            gap={2}
          >
            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Server Uptime
                </Typography>
                <Typography variant="body2" color="success.main">
                  99.9%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={99.9}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Database Performance
                </Typography>
                <Typography variant="body2" color="success.main">
                  98.5%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={98.5}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    background:
                      "linear-gradient(135deg, #020aa5ff 0%, #0a036bff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Storage Usage
                </Typography>
                <Typography variant="body2" color="warning.main">
                  75%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
