import * as React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 12,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: (t) => (t.palette.mode === 'light' ? 'background.paper' : 'background.default'),
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {year} National Social Security Fund — Pensioner Self-Service Portal
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          Secure • Accessible • Reliable
        </Typography>
      </Container>
    </Box>
  );
}
