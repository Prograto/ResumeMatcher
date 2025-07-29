import { Briefcase } from "lucide-react";
import { useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-primary-700 flex items-center">
                <Briefcase className="mr-2 text-primary-500" />
                JobMatch Pro
              </a>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <a 
                href="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Optimize Resume
              </a>
              <a 
                href="/cover-letters" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/cover-letters") 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cover Letters
              </a>
              <a 
                href="/ats-scanner" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/ats-scanner") 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ATS Scanner
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}