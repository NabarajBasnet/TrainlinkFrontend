import { Instagram, Twitter, Youtube, Linkedin, Mail, MapPin, Phone, Clock, Trophy } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-950 pt-16 pb-10 px-6 md:px-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-2">
                            <Trophy className="w-8 h-8 text-orange-500" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">TrainLink</h1>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Connecting fitness enthusiasts with certified professionals to help you achieve your health goals.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mt-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">123 Fitness Ave, San Francisco, CA</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-600 text-sm">(555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-600 text-sm">support@trainlink.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-600 text-sm">Mon-Fri: 6AM - 10PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-orange-500/30 inline-block text-gray-950">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href="/about" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                About Us
                            </a></li>
                            <li><a href="/trainers" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Find Trainers
                            </a></li>
                            <li><a href="/pricing" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Pricing
                            </a></li>
                            <li><a href="/success-stories" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Success Stories
                            </a></li>
                            <li><a href="/faq" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                FAQ
                            </a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-orange-500/30 inline-block text-gray-950">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="/contact" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Contact Us
                            </a></li>
                            <li><a href="/help-center" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Help Center
                            </a></li>
                            <li><a href="/privacy" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Privacy Policy
                            </a></li>
                            <li><a href="/terms" className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                Terms of Service
                            </a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-950">Join Our Newsletter</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Get fitness tips and special offers straight to your inbox.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-gray-950"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Subscribe</span>
                            </button>
                        </form>

                        {/* Social Media */}
                        <div className="mt-6">
                            <h4 className="text-gray-700 text-sm mb-3">Follow Us</h4>
                            <div className="flex space-x-3">
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-orange-500 flex items-center justify-center transition-colors shadow-sm">
                                    <Twitter className="w-4 h-4 text-gray-600 hover:text-white" />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-orange-500 flex items-center justify-center transition-colors shadow-sm">
                                    <Instagram className="w-4 h-4 text-gray-600 hover:text-white" />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-orange-500 flex items-center justify-center transition-colors shadow-sm">
                                    <Youtube className="w-4 h-4 text-gray-600 hover:text-white" />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-orange-500 flex items-center justify-center transition-colors shadow-sm">
                                    <Linkedin className="w-4 h-4 text-gray-600 hover:text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} TrainLink. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;