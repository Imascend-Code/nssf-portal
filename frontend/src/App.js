import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import NewRequest from "./pages/Requests/NewRequest";
import MyRequests from "./pages/Requests/MyRequests";
import RequestDetail from "./pages/Requests/RequestDetail";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRequests from "./pages/Admin/Requests";
import AdminUsers from "./pages/Admin/Users";
import Home from "./pages/Home";
import Features from "./pages/Features"; // <-- add
import Support from "./pages/Support"; // <-- add
import Protected from "./components/routing/Protected";
import Root from "./components/layout/Root";
import AdminReports from "./pages/Admin/Reports";
import Reports from "./pages/Reports";
export default function App() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(Root, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/features", element: _jsx(Features, {}) }), _jsx(Route, { path: "/support", element: _jsx(Support, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Protected, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/payments", element: _jsx(Protected, { children: _jsx(Payments, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(Protected, { children: _jsx(Profile, {}) }) }), _jsx(Route, { path: "/requests/new", element: _jsx(Protected, { children: _jsx(NewRequest, {}) }) }), _jsx(Route, { path: "/requests", element: _jsx(Protected, { children: _jsx(MyRequests, {}) }) }), _jsx(Route, { path: "/requests/:id", element: _jsx(Protected, { children: _jsx(RequestDetail, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(Protected, { roles: ["ADMIN"], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/requests", element: _jsx(Protected, { roles: ["ADMIN", "STAFF"], children: _jsx(AdminRequests, {}) }) }), _jsx(Route, { path: "/admin/users", element: _jsx(Protected, { roles: ["ADMIN"], children: _jsx(AdminUsers, {}) }) }), _jsx(Route, { path: "/reports", element: _jsx(Protected, { children: _jsx(Reports, {}) }) }), _jsx(Route, { path: "/admin/reports", element: _jsx(Protected, { roles: ["ADMIN", "STAFF"], children: _jsx(AdminReports, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
