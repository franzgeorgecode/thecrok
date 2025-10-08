import React from 'react';
import { FileText, Zap, Lock, Users, Globe, ArrowRight, Check, Mail, Github, Twitter } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8" />
              <span className="text-2xl font-bold">Crok</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="hover:text-gray-600 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-gray-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-gray-600 transition-colors">
                Contact
              </button>
            </nav>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Document sharing,
                <br />
                <span className="relative">
                  simplified
                  <div className="absolute bottom-2 left-0 w-full h-3 bg-gray-200 -z-10"></div>
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create, share, and collaborate on documents with ease. 
                Public or private, the choice is yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-lg flex items-center justify-center gap-2"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-4 border-2 border-black hover:bg-gray-50 transition-colors font-medium text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-100 border-4 border-black relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=800&fit=crop"
                  alt="Document collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-black"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern document collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Create and edit documents instantly with our optimized platform'
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'Secure & Private',
                description: 'Your private documents stay private. Full control over visibility'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Collaborative',
                description: 'Share public documents and let anyone contribute'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Accessible Anywhere',
                description: 'Access your documents from any device, anytime'
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Rich Content',
                description: 'Add images, format text, and create beautiful documents'
              },
              {
                icon: <Check className="w-8 h-8" />,
                title: 'Simple & Clean',
                description: 'No clutter, no distractions. Just pure productivity'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white border-2 border-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full border-4 border-black"
                />
                <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-black -z-10"></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6">
                Collaborate with your team
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Share documents publicly and let your entire team contribute. 
                Track changes, see who created what, and maintain full transparency.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time document updates',
                  'User attribution on all documents',
                  'Public and private visibility options',
                  'Image upload support'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { number: '10K+', label: 'Documents Created' },
              { number: '5K+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl lg:text-6xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users creating and sharing documents with Crok
          </p>
          <button
            onClick={onGetStarted}
            className="px-12 py-5 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-xl inline-flex items-center gap-3"
          >
            Create Your First Document
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6" />
                <span className="text-xl font-bold">Crok</span>
              </div>
              <p className="text-gray-600 mb-4">
                Simple document sharing for everyone
              </p>
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:hello@crok.app" className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-black transition-colors">Features</button></li>
                <li><button onClick={onGetStarted} className="hover:text-black transition-colors">Pricing</button></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-black transition-colors">About</button></li>
                <li><a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Blog</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/privacy" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-black transition-colors">Terms of Service</a></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-black transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2025 Crok. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
