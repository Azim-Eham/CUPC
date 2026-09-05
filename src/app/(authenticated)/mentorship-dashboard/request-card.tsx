"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { respondToMentorship } from "@/app/actions/mentorship";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type RequestType = {
  id: string;
  message: string;
  status: string;
  createdAt: Date;
  requester: {
    name: string;
    profileImage: string | null;
    department: string;
    studentId: string | null;
  };
};

export function RequestCard({ request }: { request: RequestType }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleResponse(status: "ACCEPTED" | "DECLINED") {
    setIsUpdating(true);
    const result = await respondToMentorship(request.id, status);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Request ${status.toLowerCase()} successfully.`);
    }
    setIsUpdating(false);
  }

  return (
    <div className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12 border border-[#e2e2ea]">
          <AvatarImage src={request.requester.profileImage || ""} />
          <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-bold text-brand-navy">{request.requester.name}</h4>
          <p className="text-sm text-text-secondary">{request.requester.department} {request.requester.studentId ? `| ID: ${request.requester.studentId}` : ""}</p>
          <p className="text-xs text-text-muted mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
          {request.status}
        </div>
      </div>

      <div className="bg-surface-alt p-4 rounded-xl mb-6">
        <p className="text-sm text-text-primary whitespace-pre-wrap">{request.message}</p>
      </div>

      {request.status === "PENDING" && (
        <div className="flex gap-3">
          <Button
            onClick={() => handleResponse("ACCEPTED")}
            disabled={isUpdating}
            className="flex-1 bg-brand-navy text-white hover:bg-brand-navy/90"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleResponse("DECLINED")}
            disabled={isUpdating}
            variant="outline"
            className="flex-1"
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
