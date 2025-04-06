import PropTypes from "prop-types";

const Warning = ({ message, onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 flex items-start justify-center z-50 pt-24">
        <div className="relative p-4 bg-thought-75 shadow-2xl w-90 max-w-xs sm:max-w-md md:max-w-lg  bg-opacity-90 rounded-2xl ">
          <h3 className="text-lg p-1">Confirm the Action</h3>
          <p className="text-gray-950 mb-6">
            {message}
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg"
              onClick={onClose}
            >
              No
            </button>
            <button
              className="px-4 py-2 bg-thought-100 text-white font-medium rounded-lg hover:bg-hub-100 transition-colors"
              onClick={onConfirm}
            >
              Yes
            </button>
        </div>
      </div>
    </div>
  );
};

Warning.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Warning;
