
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProModal from "@/components/modals/pro-modal";
import CardModal from "@/components/modals/card-modal";

export const ModalProvider = () => {
  const [isMounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CardModal />
      <ProModal />
    </QueryClientProvider>
  );
};
