import { jsx as _jsx } from "react/jsx-runtime";
// src/components/notifications/NotificationsBell.tsx
import * as React from "react";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchUnreadCount } from "../api/notifications";
export default function NotificationsBell({ onClick }) {
    const [unread, setUnread] = React.useState(0);
    React.useEffect(() => {
        let active = true;
        fetchUnreadCount().then((d) => active && setUnread(d.unread)).catch(() => { });
        const id = setInterval(() => {
            fetchUnreadCount().then((d) => active && setUnread(d.unread)).catch(() => { });
        }, 30000);
        return () => { active = false; clearInterval(id); };
    }, []);
    return (_jsx(Tooltip, { title: "Notifications", children: _jsx(IconButton, { onClick: onClick, size: "small", "aria-label": "Notifications", children: _jsx(Badge, { color: "error", badgeContent: unread, max: 99, children: _jsx(NotificationsIcon, {}) }) }) }));
}
