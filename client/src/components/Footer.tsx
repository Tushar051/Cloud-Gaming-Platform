import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary font-audiowide text-xl mb-4">AYSTAR<span className="text-accent">PLAY</span></h3>
            <p className="text-gray-400 mb-4">Next-generation cloud gaming platform. Play anywhere, anytime, on any device.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-white text-lg mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition">Home</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-accent transition">Games</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-white text-lg mb-4">SUPPORT</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">System Requirements</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">Server Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition">Bug Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-white text-lg mb-4">NEWSLETTER</h4>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new games and features.</p>
            <form>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-900 border border-gray-700 rounded-l-lg py-2 px-4 w-full focus:outline-none focus:border-primary"
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/80 text-white px-4 rounded-r-lg transition"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} NexusPlay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
