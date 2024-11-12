import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import PropTypes from 'prop-types';

export function Pagination({ totalPages, handleNextPage, handlePreviousPage, page }) {
    return (
        <div className="flex flex-row items-center space-x-4 ">
            <IoIosArrowDropleftCircle
                className={`text-2xl cursor-pointer ${page === 1 ? 'hidden' : 'text-blue-500'}`}
                onClick={handlePreviousPage}
            />
            <span>{page} of {totalPages}</span>
            <IoIosArrowDroprightCircle
                className={`text-2xl cursor-pointer ${page === totalPages ? 'hidden ' : 'text-blue-500'}`}
                onClick={handleNextPage}
            />
        </div>
    )
}

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    handleNextPage: PropTypes.func.isRequired,
    handlePreviousPage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired
}