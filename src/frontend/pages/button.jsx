import PropTypes from 'prop-types';

const Button = ({ onClick, children, className = '', size, variant }) => {
  const sizeClass = size === "lg" ? "px-6 py-3" : "px-4 py-2";
  const variantClass = variant === "outline" ? "border-2 border-gray-300" : "bg-indigo-600 hover:bg-indigo-700 text-white";
  
  return (
    <button
      onClick={onClick}
      className={`rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,  
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', 'sm']), 
  variant: PropTypes.oneOf(['outline', 'filled'])  
};

export default Button;
