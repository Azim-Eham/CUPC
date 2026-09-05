"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Star, Award, Loader2 } from "lucide-react";
import { addAchievement } from "@/app/actions/achievement";

export function CreateAchievementForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const type = formData.get("type") as string;

    if (!title || !description || !date || !type) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await addAchievement({ title, description, date, type });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/achievements");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e2e2ea]">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-brand-navy mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="e.g. National Physics Olympiad Winners"
            className="w-full px-4 py-3 rounded-xl border border-[#e2e2ea] focus:outline-none focus:ring-2 focus:ring-[#f2a93c]/50 focus:border-[#f2a93c] transition-all bg-surface-alt/50 appearance-none min-h-[50px] leading-normal"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-bold text-brand-navy mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#e2e2ea] focus:outline-none focus:ring-2 focus:ring-[#f2a93c]/50 focus:border-[#f2a93c] transition-all bg-surface-alt/50"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-bold text-brand-navy mb-2">
            Icon Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="type" value="trophy" defaultChecked className="peer sr-only" />
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e2e2ea] peer-checked:border-[#f2a93c] peer-checked:bg-[#f2a93c]/5 transition-all text-text-secondary peer-checked:text-[#f2a93c]">
                <Trophy className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Trophy</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="type" value="star" className="peer sr-only" />
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e2e2ea] peer-checked:border-[#f2a93c] peer-checked:bg-[#f2a93c]/5 transition-all text-text-secondary peer-checked:text-[#f2a93c]">
                <Star className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Star</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="type" value="award" className="peer sr-only" />
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-[#e2e2ea] peer-checked:border-[#f2a93c] peer-checked:bg-[#f2a93c]/5 transition-all text-text-secondary peer-checked:text-[#f2a93c]">
                <Award className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Award</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-brand-navy mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            placeholder="Detailed description of the achievement..."
            className="w-full px-4 py-3 rounded-xl border border-[#e2e2ea] focus:outline-none focus:ring-2 focus:ring-[#f2a93c]/50 focus:border-[#f2a93c] transition-all bg-surface-alt/50 resize-y"
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full font-semibold text-text-secondary hover:bg-surface-alt transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold py-3 px-8 rounded-full transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Achievement"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
