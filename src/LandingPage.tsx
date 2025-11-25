import { useState } from 'react';
import { ArrowRight, Zap, Download, FileText, Share2, CheckCircle, Sparkles, Star } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to app or capture lead
    window.location.href = '/app';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/retro_wire_logo.png" alt="RetroWire Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold text-white">RetroWire</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition">Benefits</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            </nav>
            <button 
              onClick={() => window.location.href = '/app'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Professional Electronics Wiring Made Simple</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Design Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Electronics Wiring
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The visual wiring diagram tool that saves you hours and eliminates costly mistakes. 
            Perfect for retrofitting vintage electronics, custom builds, and professional projects.
          </p>

          <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition transform hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Free trial included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-800/50 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-400">Projects Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Professional Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-gray-400">4.9/5 Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional-grade features designed for electronics enthusiasts and professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Drag & Drop Interface',
                description: 'Intuitive visual editor makes wiring diagrams effortless'
              },
              {
                icon: FileText,
                title: 'Component Library',
                description: 'Pre-loaded with switches, relays, power supplies, and more'
              },
              {
                icon: Download,
                title: 'Export Anywhere',
                description: 'PDF, PNG, or JSON - share your work in any format'
              },
              {
                icon: Share2,
                title: 'Auto-Wire Detection',
                description: 'Smart routing suggests optimal wire paths automatically'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Save Time,
                <br />
                Eliminate Errors
              </h2>
              <div className="space-y-6">
                {[
                  'Reduce wiring time by 70% with visual planning',
                  'Catch mistakes before they become costly',
                  'Professional diagrams for client presentations',
                  'Built-in validation prevents common wiring errors',
                  'Perfect for vintage electronics restoration'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-gray-400 text-center">
                [Benefit Visualization/Animation]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Try free for 7 days, then just $10/month
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm mb-4">
                  7-DAY FREE TRIAL
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">RetroWire Pro</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">$10</span>
                  <span className="text-blue-100 text-xl">/month</span>
                </div>
                <p className="text-blue-100">Cancel anytime, no questions asked</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Unlimited projects</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Full component library</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">PDF & PNG export</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Auto-wire detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                  <span className="text-white font-medium">Bill of materials generator</span>
                </li>
              </ul>

              <button 
                onClick={() => window.location.href = '/app'}
                className="w-full bg-white hover:bg-gray-100 text-blue-600 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
              >
                Start 7-Day Free Trial
              </button>
              
              <p className="text-center text-blue-100 text-sm mt-4">
                No credit card required • Full access during trial
              </p>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-6">
                🔒 Secure payment • 💯 Money-back guarantee • ❤️ Used by 500+ professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Wiring Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals and hobbyists who trust RetroWire
          </p>
          <button
            onClick={() => window.location.href = '/app'}
            className="bg-white hover:bg-gray-100 text-blue-600 px-12 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Start Building Now</span>
            <ArrowRight className="h-6 w-6" />
          </button>
          <p className="text-blue-100 mt-4">No credit card required • 7-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/retro_wire_logo.png" alt="RetroWire" className="h-8 w-8" />
                <span className="text-xl font-bold text-white">RetroWire</span>
              </div>
              <p className="text-gray-400">
                Professional electronics wiring diagrams made simple.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="/app" className="text-gray-400 hover:text-white transition">Launch App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RetroWire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
