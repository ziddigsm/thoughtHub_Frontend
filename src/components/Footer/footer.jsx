import PropTypes from 'prop-types';

function Footer({ isModalOpen }) {
  return (
    <footer
      className={`${
        isModalOpen ? "blur-sm" : ""
      } bg-black text-white text-center p-10`}
    >
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold mb-4">
          &copy; 2024 ThoughtHub. All rights reserved.
        </p>
        <div className="flex space-x-8 mb-6">
          <a href="/home" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a className="text-gray-300 hover:text-white">About Us</a>
          <a className="text-gray-300 hover:text-white">Privacy Policy</a>
          <a className="text-gray-300 hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
Footer.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
};

export default Footer;