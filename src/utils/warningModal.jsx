import PropTypes from "prop-types";

const Warning = ({ message, onClose }) => {
    return (
      <div className="fixed  bg-thought-100 p-4 shadow-lg w-80 max-w-xs sm:max-w-md md:max-w-lg  justify-center rounded-xl backdrop-blur-lg bg-opacity-50 z-50">
          <b className="text-lg p-1">Confirm the Action</b>
          <br />
          <span className="text-black break-words whitespace-normal p-1">
            {message}
          </span>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-2 rounded-lg"
              onClick={onClose}
            >
              Yes
            </button>
            <button
              className="bg-thought-100 hover:bg-hub-100 text-white px-8 py-2 rounded-lg"
              onClick={onClose}
            >
              No
            </button>
          </div>
      </div>
    );
  };
  
Warning.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Warning;
