import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import PropTypes from "prop-types";

export function Pagination({
  totalPages,
  handleNextPage,
  handlePreviousPage,
  page,
}) {
  return (
    <div className="flex flex-row items-center space-x-4 p-1 bg-thought-75 rounded-lg shadow-md backdrop-blur-lg">
      <IoIosArrowDropleftCircle
        className={`text-3xl cursor-pointer transition duration-200 ease-in-out 
                    ${
                      page === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-hub-100 hover:text-thought-100"
                    }`}
        onClick={page !== 1 ? handlePreviousPage : null}
      />
      <span className="px-4 py-2 text-base font-semibold text-grey-900 rounded-lg shadow-md">
        {page} of {totalPages}
      </span>
      <IoIosArrowDroprightCircle
        className={`text-3xl cursor-pointer transition duration-200 ease-in-out 
                    ${
                      page === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-thought-100 hover:text-hub-100"
                    }`}
        onClick={page !== totalPages ? handleNextPage : null}
      />
    </div>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handlePreviousPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};
