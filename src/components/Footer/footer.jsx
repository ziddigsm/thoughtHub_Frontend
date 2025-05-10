import PropTypes from "prop-types";

function Footer({ isModalOpen }) {
  return (
    <footer
      className={`${
        isModalOpen ? "blur-sm pointer-events-none" : ""
      } bg-black text-white text-center p-10 relative z-10`}
    >
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold mb-4">
          &copy; 2025 ThoughtHub. All rights reserved.
        </p>
        <div className="flex space-x-8 mb-6">
          <a href="/home" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a className="text-gray-300 pointer-events-none hover:text-white">
            About Us
          </a>
          <a className="text-gray-300 pointer-events-none hover:text-white">
            Privacy Policy
          </a>
          <a
            href="https://www.linkedin.com/in/mohammadziddi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            Contact (Ziddi)
          </a>
          <a
            href="https://www.linkedin.com/in/ghazi-rahman-shaik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            Contact (Ghazi)
          </a>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
};

export default Footer;
