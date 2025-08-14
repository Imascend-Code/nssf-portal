import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Divider,
  Slide,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import { updateSW } from '@/swRegistration';

export default function PWAUpdateCard() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const onReady = () => setOpen(true);
    window.addEventListener('pwa-update-ready', onReady);
    return () => window.removeEventListener('pwa-update-ready', onReady);
  }, []);

  const handleRefresh = () => {
    setOpen(false);
    updateSW(true); // activates and reloads
  };

  const handleClose = () => setOpen(false);

  return (
    <Slide in={open} direction="up" mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 12, sm: 16, md: 24 },
          bottom: { xs: 12, sm: 16, md: 24 },
          zIndex: (t) => t.zIndex.snackbar, // above content, below dialogs
        }}
        role="dialog"
        aria-label="Application update available"
      >
        <Card
          elevation={8}
          sx={{
            minWidth: 320,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(6px)',
            background:
              theme.palette.mode === 'light'
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(17,25,40,0.8)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1.25, pl: 1.5 }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                borderRadius: 2,
                mr: 1.25,
                bgcolor:
                  theme.palette.mode === 'light'
                    ? 'primary.main'
                    : 'primary.dark',
                color: 'primary.contrastText',
              }}
            >
              <SystemUpdateAltRoundedIcon fontSize="small" />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                Update available
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                A new version of the app is ready.
              </Typography>
            </Box>

            <IconButton
              aria-label="Dismiss"
              onClick={handleClose}
              size="small"
              edge="end"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <CardContent sx={{ pt: 1.25, pb: 0 }}>
            <Typography variant="body2">
              Refresh to get the latest features and fixes.
            </Typography>
          </CardContent>

          <CardActions sx={{ p: 1.25, pt: 0.75, justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} size="small" color="inherit">
              Later
            </Button>
            <Button
              onClick={handleRefresh}
              size="small"
              variant="contained"
              startIcon={<SystemUpdateAltRoundedIcon fontSize="small" />}
            >
              Refresh
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Slide>
  );
}
