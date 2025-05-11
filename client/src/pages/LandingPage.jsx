import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

// Remove onNavigateToAuth from props
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <header className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Simul<span className="text-purple-400">Coder</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Collaborate, Code, Conquer. Real-time pair programming, simplified.
        </p>
      </header>

      <main className="text-center mb-12 animate-slideUp">
        {/* Changed button to Link and removed onClick */}
        <Link
          to="/register" // Or "/login" if you prefer
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Get Started
        </Link>
      </main>

      <section className="w-full max-w-4xl grid md:grid-cols-3 gap-8 mb-12">
        {[
          { title: "Real-time Editor", description: "Code together seamlessly with our synchronized editor.", icon: "📝" },
          { title: "Session Links", description: "Easily create and share coding sessions with unique links.", icon: "🔗" },
          { title: "Practice Questions", description: "Hone your skills with a variety of coding challenges.", icon: "❓" },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-xl card-hover-effect animate-fadeInUp"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="text-4xl mb-4 text-purple-400">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <footer className="text-center text-gray-500 animate-fadeIn">
        <p>&copy; {new Date().getFullYear()} SimulCoder. All rights reserved.</p>
      </footer>

      {/* Basic CSS for animations (can be moved to index.css or a dedicated animation css file) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out 0.3s forwards; opacity: 0; } /* Start with opacity 0 */
        .animate-fadeInUp { animation: fadeInUp 0.7s ease-out forwards; opacity: 0; } /* Start with opacity 0 */
      `}</style>
    </div>
  );
};

export default LandingPage;