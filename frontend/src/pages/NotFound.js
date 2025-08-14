import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/NotFound.tsx
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function NotFound() {
    const location = useLocation();
    useEffect(() => console.warn("404:", location.pathname), [location.pathname]);
    return (_jsx("div", { className: "min-h-[60vh] flex items-center justify-center px-4", children: _jsxs(Card, { className: "max-w-md w-full rounded-2xl shadow-sm", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-5xl font-extrabold", children: "404" }), _jsx(CardDescription, { className: "text-base mt-2", children: "The page you\u2019re looking for doesn\u2019t exist." })] }), _jsx(CardContent, { className: "flex justify-center", children: _jsx(Button, { asChild: true, children: _jsx(Link, { to: "/", children: "Back to Home" }) }) })] }) }));
}
