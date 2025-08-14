// src/components/notifications/NotificationsBell.tsx
import * as React from "react";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchUnreadCount } from "../api/notifications";

export default function NotificationsBell({ onClick }: { onClick: () => void }) {
  const [unread, setUnread] = React.useState<number>(0);

  React.useEffect(() => {
    let active = true;
    fetchUnreadCount().then((d) => active && setUnread(d.unread)).catch(() => { });
    const id = setInterval(() => {
      fetchUnreadCount().then((d) => active && setUnread(d.unread)).catch(() => { });
    }, 30_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <Tooltip title="Notifications">
      <IconButton onClick={onClick} size="small" aria-label="Notifications">
        <Badge color="error" badgeContent={unread} max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
