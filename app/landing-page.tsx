"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  FileText, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Play,
  Brain,
  Sparkles,
  Rocket,
  MessageSquare
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState("resume-parser")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      id: "resume-parser",
      title: "AI Resume Parser",
      description: "Intelligent resume analysis and data extraction",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      details: [
        "Extract key information automatically",
        "Parse multiple file formats (PDF, DOC, TXT)",
        "Identify skills, experience, and education",
        "Smart data validation and cleaning",
        "Instant candidate profile creation"
      ]
    },
    {
      id: "ai-interview",
      title: "AI-Powered Interviews",
      description: "Conduct intelligent interviews with AI assistance",
      icon: Bot,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      details: [
        "AI-generated interview questions",
        "Voice and text response options",
        "Real-time question adaptation",
        "Automated scoring and feedback",
        "24/7 interview availability"
      ]
    },
    {
      id: "candidate-scoring",
      title: "AI Candidate Scoring",
      description: "Intelligent candidate evaluation and ranking",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      details: [
        "Multi-factor candidate assessment",
        "Skills gap analysis",
        "Cultural fit evaluation",
        "Predictive hiring success",
        "Objective scoring algorithms"
      ]
    },
    {
      id: "job-matching",
      title: "Smart Job Matching",
      description: "AI-powered candidate-job matching",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      details: [
        "Intelligent candidate-job pairing",
        "Skills-based matching algorithms",
        "Experience level assessment",
        "Cultural alignment scoring",
        "Best-fit recommendations"
      ]
    }
  ]

  const stats = [
    { label: "Resumes Parsed", value: "10K+", icon: FileText },
    { label: "AI Interviews", value: "5K+", icon: Bot },
    { label: "Candidates Scored", value: "25K+", icon: Target },
    { label: "Jobs Matched", value: "8K+", icon: Users }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process resumes and conduct interviews in minutes, not hours"
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      description: "Advanced algorithms that learn and improve over time"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with data privacy compliance"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access talent from anywhere in the world"
    }
  ]

  const currentFeature = features.find(f => f.id === activeFeature)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ATS AI Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Sign In
              </Button>
              <Button onClick={() => router.push("/register")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Hiring Process</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of recruitment with our AI-powered ATS platform. 
              From intelligent resume parsing to AI interviews, we're revolutionizing how you find and hire top talent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Features That Set Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how artificial intelligence is transforming every aspect of your recruitment process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeFeature === feature.id 
                      ? `${feature.bgColor} ${feature.borderColor} border-2` 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Feature Details */}
            <div className="lg:pl-8">
              {currentFeature && (
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-16 h-16 rounded-xl ${currentFeature.bgColor} flex items-center justify-center`}>
                        <currentFeature.icon className={`w-8 h-8 ${currentFeature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{currentFeature.title}</CardTitle>
                        <CardDescription className="text-lg">{currentFeature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentFeature.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${currentFeature.color}`} />
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button className={`${currentFeature.bgColor} ${currentFeature.color} hover:opacity-80`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our AI-Powered ATS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of intelligent automation in recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies already using AI to hire smarter and faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
              </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              <MessageSquare className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ATS AI Platform</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing recruitment with the power of artificial intelligence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Resume Parser</li>
                <li>AI Interviews</li>
                <li>Candidate Scoring</li>
                <li>Job Matching</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ATS AI Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
