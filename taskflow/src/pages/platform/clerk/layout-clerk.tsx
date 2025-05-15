const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center mt-30">{children}</div>
  );
};

export default ClerkLayout;