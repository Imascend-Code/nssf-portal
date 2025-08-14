// src/pages/NotFound.tsx
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Link, useLocation } from "react-router-dom"
import { useEffect } from "react"

export default function NotFound() {
  const location = useLocation()
  useEffect(() => console.warn("404:", location.pathname), [location.pathname])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-extrabold">404</CardTitle>
          <CardDescription className="text-base mt-2">
            The page you’re looking for doesn’t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
