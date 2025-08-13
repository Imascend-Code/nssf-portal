import * as React from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

export default function AdminUsers() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader title={<Typography variant="h6">Users</Typography>} />
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              This section is a stub. Add a users API endpoint (e.g. <code>GET /users/</code>) and we can render a paginated table with role filters and activation toggles.
            </Typography>
            <Alert severity="info">
              Tip: expose <strong>search</strong>, <strong>role</strong>, and <strong>is_active</strong> filters in the API to match the Requests page UX.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
