// src/components/layout/Navbar.tsx
import * as React from 'react';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Button, Box, Stack, Typography, Avatar,
  Menu, MenuItem, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, useTheme, Tooltip, Container
} from '@mui/material';

import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import ThemeToggle from '../ui/ThemeToggle';
import { useAuthStore } from '@/store/auth';

type NavItem = { to: string; label: string; icon?: React.ReactNode };

/** Public-only items (hide when logged in) */
const PUBLIC_ONLY: NavItem[] = [
  { to: '/features', label: 'Features', icon: <StarOutlineIcon fontSize="small" /> },
  { to: '/support', label: 'Support', icon: <HelpOutlineIcon fontSize="small" /> },
];

/** Common items (show for everyone) */
const COMMON: NavItem[] = [
  { to: '/payments', label: 'Payments', icon: <PaymentsIcon fontSize="small" /> },
  { to: '/requests', label: 'Requests', icon: <RequestPageIcon fontSize="small" /> },
];

/** Admin items (only for admins) */
const ADMIN_ONLY: NavItem[] = [
  { to: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { to: '/admin/requests', label: 'Admin Requests', icon: <RequestPageIcon fontSize="small" /> },
  { to: '/admin/users', label: 'Admin Users', icon: <PersonIcon fontSize="small" /> },
];

// Button that renders a NavLink with active styles
const NavLinkButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Button
    component={NavLink}
    to={to}
    disableElevation
    sx={{
      px: 1.5, py: 0.75, borderRadius: 1.5, typography: 'body2',
      // style prop goes to NavLink (receives isActive)
      style: ({ isActive }: { isActive: boolean }) => ({
        backgroundColor: isActive ? 'rgba(0,0,0,0.08)' : 'transparent',
      }),
      color: 'text.secondary',
      '&.active, &:hover': { color: 'text.primary' },
    }}
  >
    {children}
  </Button>
);

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // User menu
  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuEl);
  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const displayName = user?.full_name || user?.email || '';
  const initials = (displayName || 'NA').slice(0, 2).toUpperCase();

  const isAdmin = !!user && ((user as any).is_superuser || (user as any).is_staff || (user as any).role === 'ADMIN');

  /** Build nav items based on auth/admin status */
  const navItems: NavItem[] = React.useMemo(() => {
    const base = [...COMMON];
    if (!user) base.unshift(...PUBLIC_ONLY);
    if (isAdmin) base.push(...ADMIN_ONLY);
    return base;
  }, [user, isAdmin]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: (t) =>
          t.palette.mode === 'light'
            ? 'rgba(255,255,255,0.7)'
            : 'rgba(10,37,64,0.7)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, gap: 1 }}>
          {/* Brand */}
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            startIcon={<SecurityIcon />}
            sx={{ fontWeight: 600, letterSpacing: 0.2 }}
          >
            NSSF Pensioner
          </Button>

          {/* Desktop nav */}
          {isDesktop && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
              {navItems.map((item) => (
                <NavLinkButton key={item.to} to={item.to}>
                  {item.label}
                </NavLinkButton>
              ))}
            </Stack>
          )}

          <Box sx={{ flex: 1 }} />

          {/* Right side */}
          {isDesktop ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {user ? (
                <>
                  {/* Dashboard quick link */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/dashboard')}
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>

                  {/* Visible name next to avatar */}
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 220,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={displayName}
                  >
                    {displayName}
                  </Typography>

                  {/* Avatar opens small menu for Profile/Dashboard */}
                  <Tooltip title={displayName}>
                    <IconButton onClick={handleAvatarClick} size="small" aria-label="account menu">
                      <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={menuEl}
                    open={menuOpen}
                    onClose={closeMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      onClick={() => {
                        closeMenu();
                        navigate('/profile');
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        closeMenu();
                        navigate('/dashboard');
                      }}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                  </Menu>

                  {/* Dedicated Logout button */}
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    startIcon={<LogoutIcon />}
                    onClick={() => {
                      logout();
                      navigate('/login', { replace: true });
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate('/login')}
                  startIcon={<LockIcon />}
                >
                  Sign in
                </Button>
              )}

              {/* Theme toggle only on mobile per your preference — so it’s hidden on desktop */}
            </Stack>
          ) : (
            // Mobile: theme toggle + hamburger
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ThemeToggle />
              <IconButton onClick={() => setDrawerOpen(true)} aria-label="open menu">
                <MenuIcon />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 1.5 }}>
          <Box sx={{ px: 1, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" sx={{ flex: 1 }}>
              NSSF Pensioner
            </Typography>
          </Box>

          {user && (
            <Box sx={{ px: 1.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Avatar>{initials}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                  title={displayName}
                >
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Signed in
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <List sx={{ pt: 0 }}>
            {navItems.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
                // style receives isActive from NavLink
                style={({ isActive }: { isActive: boolean }) => ({
                  background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                })}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ px: 1.5, py: 1 }}>
            {user ? (
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DashboardIcon />}
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/profile');
                  }}
                >
                  Profile
                </Button>
                <Button
                  fullWidth
                  color="error"
                  variant="text"
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    setDrawerOpen(false);
                    logout();
                    navigate('/login', { replace: true });
                  }}
                >
                  Logout
                </Button>
              </Stack>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<LockIcon />}
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/login');
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
