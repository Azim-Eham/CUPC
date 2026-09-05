"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/app/actions/event";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    setIsDeleting(true);
    const result = await deleteEvent(eventId);
    setIsDeleting(false);
    
    if (result.error) {
      alert(result.error);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
      title="Delete event"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
