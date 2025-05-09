const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-20 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo and Company Info */}
        <div>
          <h2 className="text-5xl font-serif font-extrabold text-orange-500">
            Ed<span className="text-white text-4xl align-top">Tech</span>
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            © 2025 Edlogue, Inc<br />
            All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-title text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a className="link link-hover">Home</a></li>
            <li><a className="link link-hover">About</a></li>
            <li><a className="link link-hover">Courses</a></li>
            <li><a className="link link-hover">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="footer-title text-lg font-semibold mb-3">Connect with Us</h3>
          <ul className="space-y-2">
            <li><a className="link link-hover">Facebook</a></li>
            <li><a className="link link-hover">Twitter</a></li>
            <li><a className="link link-hover">LinkedIn</a></li>
            <li><a className="link link-hover">Instagram</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="footer-title text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><a className="link link-hover">Terms</a></li>
            <li><a className="link link-hover">Privacy</a></li>
            <li><a className="link link-hover">Refund Policy</a></li>
            <li><a className="link link-hover">Sitemap</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
