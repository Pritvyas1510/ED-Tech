// ./Pages/NotFound/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
     
      <h1 className="text-6xl font-extrabold mb-4"> <span className="text-red-700">404</span>  Page Not Found</h1>
      <p className="text-lg mb-6 max-w-md text-center">
        Oops! The page you're trying to reach doesn't exist or has been moved.
      </p>
     
    </div>
  );
};

export default NotFound;
