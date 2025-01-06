import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Breadcrumb = () => {
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    // Store the current location as the previous page for the next navigation
    const currentPath = location.pathname;
    const prevPath = localStorage.getItem("prevPage");
    setPreviousPage(prevPath);
    localStorage.setItem("prevPage", currentPath);
  }, [location]);

  return (
    <div className="mt-28 px-7 text-xs space-x-3">
      {previousPage ? (
        <Link to={previousPage}>Back</Link>
      ) : (
        <span>Dashboard</span>
      )}
      <span>/</span>
      <Link to={location.pathname} className="text-orange-500">
        Current Page
      </Link>
    </div>
  );
};

export default Breadcrumb;
