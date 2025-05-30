import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sign Up
            </Link>
          </div>
          <Link
            href="/todo"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            Organize Your Life with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay">
            The most intuitive and beautiful way to manage your tasks. Stay productive, stay organized, stay ahead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Link
              href="/todo"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Start Managing Tasks
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TaskFlow?</h2>
          <p className="text-xl text-gray-600">Powerful features designed for modern productivity</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Easy Task Management</h3>
            <p className="text-gray-600">
              Add, complete, and delete tasks with smooth animations and intuitive interactions.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600">Built with Next.js for optimal performance and smooth user experience.</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">User Friendly</h3>
            <p className="text-gray-600">
              Clean, modern interface that works perfectly on all devices and screen sizes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Organized?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have transformed their productivity with TaskFlow.
          </p>
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            TaskFlow
          </div>
          <p className="text-gray-400 mb-6">Making productivity beautiful and simple.</p>
          <div className="flex justify-center space-x-6">
            <Link href="/todo" className="text-gray-400 hover:text-white transition-colors">
              Todo App
            </Link>
            <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
