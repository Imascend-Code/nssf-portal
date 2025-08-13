// src/pages/Home.tsx
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CreditCard, FileText, HelpCircle, Users, ChevronRight, ShieldCheck, BarChart2, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function Home() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      title: "Payments",
      description: "View contributions, make payments, and download statements with ease.",
      icon: CreditCard,
      link: "/payments",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Requests",
      description: "Submit and track service requests with real-time updates.",
      icon: FileText,
      link: "/requests",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Beneficiaries",
      description: "Securely manage your beneficiaries and their details.",
      icon: Users,
      link: "/profile",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Support",
      description: "24/7 assistance from our dedicated support team.",
      icon: HelpCircle,
      link: "/support",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ]

  const stats = [
    { value: "98%", label: "Member Satisfaction" },
    { value: "24h", label: "Avg. Response Time" },
    { value: "10M+", label: "Secure Transactions" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800 mb-4">
          <ShieldCheck className="h-4 w-4 mr-2" />
          Your financial security is our priority
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to Your NSSF Portal
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Manage your social security contributions with our secure, intuitive platform designed for your convenience.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/dashboard" className="flex items-center gap-2">
              Go to Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/profile" className="flex items-center gap-2">
              Update Profile
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
              >
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={cardsRef}
        initial={{ opacity: 0 }}
        animate={cardsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Quick Access</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Everything you need to manage your social security, all in one place
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-start space-x-4 pb-4">
                  <div className={`p-3 rounded-lg ${feature.bg} ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                  <Button asChild variant="ghost" size="sm" className="px-0 text-indigo-600 hover:text-indigo-800">
                    <Link to={feature.link} className="flex items-center gap-1 font-medium">
                      Get started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Additional Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-800 mb-6 shadow-sm">
            <Bell className="h-4 w-4 mr-2" />
            New Features
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
            Enhanced Contribution Analytics
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Now track your contribution history with interactive charts and projections for your retirement benefits.
          </p>
          <Button asChild variant="secondary" size="lg" className="rounded-full px-8">
            <Link to="/dashboard/analytics" className="flex items-center gap-2">
              Explore Analytics <BarChart2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
}