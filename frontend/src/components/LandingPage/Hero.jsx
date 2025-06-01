import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();

    const handleStartNowClick = () => {
    navigate('/login');
  };
  
  useEffect(() => {
    const heroButton = document.getElementById('hero-cta');

    if (heroButton) {
      const handleMouseEnter = () => {
        heroButton.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
      };
      const handleMouseLeave = () => {
        heroButton.style.boxShadow = '';
      };
      const handleClick = () => {
        const nextSection = document.getElementById('widgets');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      };

      heroButton.addEventListener('mouseenter', handleMouseEnter);
      heroButton.addEventListener('mouseleave', handleMouseLeave);
      heroButton.addEventListener('click', handleClick);

      return () => {
        heroButton.removeEventListener('mouseenter', handleMouseEnter);
        heroButton.removeEventListener('mouseleave', handleMouseLeave);
        heroButton.removeEventListener('click', handleClick);
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelectorAll('.floating-element');
      parallax.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          transform: 'translateY(0px)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0px)',
            backgroundSize: '20px 20px',
            transform: 'translateY(0px)',
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="font-inter text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Everything Your Team Needs —<br />
            <span className="text-indigo-600">In One Sprint Workspace</span>
          </h1>

          {/* Subheadline */}
          <p className="font-inter text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track deployments, test cases, blockers, retrospectives and more in real time.
            Designed for productivity — not complexity.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <button
              onClick={handleStartNowClick}
              className="font-inter inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Start Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-inter text-2xl font-bold text-indigo-600 mb-1">6</div>
              <div className="font-inter text-sm text-gray-600">Core Modules</div>
            </div>
            <div className="text-center">
              <div className="font-inter text-2xl font-bold text-indigo-600 mb-1">Real-time</div>
              <div className="font-inter text-sm text-gray-600">Sprint Tracking</div>
            </div>
            <div className="text-center">
              <div className="font-inter text-2xl font-bold text-indigo-600 mb-1">Zero</div>
              <div className="font-inter text-sm text-gray-600">Setup Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-60 animate-pulse floating-element"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-indigo-200 rounded-full opacity-60 animate-pulse floating-element" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-8 h-8 bg-purple-300 rounded-full opacity-40 animate-pulse floating-element" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}

export default Hero;
