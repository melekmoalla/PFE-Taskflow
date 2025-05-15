import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, userId, orgId } = useAuth();
  const location = useLocation();

  if (!isLoaded) return (
    <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <img
          src="/tf-logo.svg"
          alt="TaskFlow logo"
          width={70}
          height={70}
          className="animate-bounce"
        />
        <p
          className="text-3xl font-bold tracking-wide text-gray-800 dark:text-gray-100"
          style={{ fontFamily: 'MyFont, sans-serif' }}
        >
          TaskFlow
        </p>
      </div>
    </div>
  );


  if (!userId) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (!orgId && location.pathname !== '/select-org') {
    return <Navigate to="/select-org" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
