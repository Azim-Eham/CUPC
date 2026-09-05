"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requestMentorship } from "@/app/actions/mentorship";
import { toast } from "sonner";

export function RequestMentorshipForm({ mentorId, mentorName }: { mentorId: string; mentorName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please explain why you want mentorship.");
      return;
    }

    setIsSubmitting(true);
    const result = await requestMentorship(mentorId, message);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Request sent to ${mentorName}!`);
      setMessage("");
      setSubmitted(true);
    }
    setIsSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
        <p className="text-sm font-medium text-amber-800">
          Status: PENDING
        </p>
        <p className="text-xs text-amber-700 mt-1">
          You have already sent a request to this mentor.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="message">Introduction & Goals</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Briefly introduce yourself and explain what you'd like guidance on..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          This message will be sent to the mentor for them to review.
        </p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending Request..." : "Send Request"}
      </Button>
    </form>
  );
}
