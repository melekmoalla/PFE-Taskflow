import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
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

  if (userId) {
    const redirectPath = orgId ? `/organization/${orgId}` : '/select-org';
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};


export default PublicRoute;