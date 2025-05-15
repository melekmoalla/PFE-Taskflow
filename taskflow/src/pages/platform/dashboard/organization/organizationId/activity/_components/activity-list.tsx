import { useEffect, useState } from "react";
import ActivityItem from "@/components/modals/card-modal/activity-item";
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiRequest } from "@/action/auth";

const ActivityList = () => {
  const navigate = useNavigate();
  const { apiRequest } = useApiRequest();
  const { orgId } = useAuth();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) {
      navigate("/select-org");
      return;
    }

    const fetchLogs = async () => {
      try {
        const logs = await apiRequest(`/api/board/card/createAuditLog/?orgId=${orgId}`, {}, "GET");
        setAuditLogs(logs);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [orgId, navigate]);

  if (loading) {
    return <ActivityList.Skeleton />;
  }

  return (
    <ol className="space-y-4 mt-4 pb-6">
      {auditLogs.length === 0 ? (
        <p className="text-xs text-center">No activity found inside this organization.</p>
      ) : (
        auditLogs.map((log, index) => <ActivityItem data={log} key={log.id || index} />)
      )}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};

export default ActivityList;
