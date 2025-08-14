// src/components/notifications/NotificationsDrawer.tsx
import * as React from "react";
import {
  Drawer, Box, Typography, IconButton, Stack, List, ListItem, ListItemText,
  ListItemSecondaryAction, Button, Chip, Divider, CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {
  fetchNotifications, markRead, markAllRead, markManyRead, Notification
} from "../api/notifications";

export default function NotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Notification[]>([]);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const d = await fetchNotifications();
      const list = Array.isArray(d) ? d : d.results ?? [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { if (open) load(); }, [open, load]);

  const toggleSelect = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleMark = async (id: number) => {
    await markRead(id);
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, was_read: true } : x)));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setItems((xs) => xs.map((x) => ({ ...x, was_read: true })));
    setSelected(new Set());
  };

  const handleMarkSelected = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await markManyRead(ids);
    setItems((xs) => xs.map((x) => (selected.has(x.id) ? { ...x, was_read: true } : x)));
    setSelected(new Set());
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 2, display: "grid", gap: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button onClick={load} size="small" variant="outlined">Refresh</Button>
          <Button onClick={handleMarkSelected} size="small" disabled={!selected.size} startIcon={<DoneIcon />}>
            Mark selected read
          </Button>
          <Button onClick={handleMarkAll} size="small" startIcon={<DoneIcon />}>
            Mark all read
          </Button>
        </Stack>

        <Divider />

        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
        ) : (
          <List dense sx={{ py: 0 }}>
            {items.map((n) => (
              <ListItem
                key={n.id}
                button
                onClick={() => toggleSelect(n.id)}
                selected={selected.has(n.id)}
                sx={{ alignItems: "flex-start" }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2">{n.subject}</Typography>
                      {!n.was_read && <Chip size="small" label="NEW" color="primary" variant="outlined" />}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.sent_at).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {!n.was_read && (
                    <IconButton edge="end" aria-label="mark read" onClick={() => handleMark(n.id)} size="small">
                      <DoneIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
