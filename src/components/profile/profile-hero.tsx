import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@prisma/client";
import { MapPin, Mail, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialLink } from "@/types/profile";

type ProfileUser = Pick<User, "name" | "role" | "department" | "profileImage" | "bio" | "coverImage" | "email"> & {
  socialLinks?: any; // Prisma Json type comes out as any/unknown
  organization?: string | null;
  designation?: string | null;
  graduationYear?: number | null;
  batch?: string | null;
};

interface ProfileHeroProps {
  user: ProfileUser;
  isSelf?: boolean;
}

export function ProfileHero({ user, isSelf }: ProfileHeroProps) {
  const socialLinks = (user.socialLinks as SocialLink[]) || [];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl mb-12">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-br from-brand-navy to-black relative">
        {user.coverImage ? (
          <Image 
            src={user.coverImage} 
            alt="Cover" 
            fill 
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="px-6 md:px-12 pb-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6">
          <div className="flex items-end gap-6">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-zinc-900 bg-zinc-800 shadow-xl rounded-2xl">
              <AvatarImage src={user.profileImage || ""} className="object-cover" />
              <AvatarFallback className="text-4xl rounded-2xl bg-zinc-800 text-zinc-400">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-zinc-50 tracking-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge variant="outline" className={`border-white/10 ${
                  user.role === "FACULTY" ? "bg-amber-500/10 text-amber-400" : 
                  user.role === "ALUMNI" ? "bg-teal-500/10 text-teal-400" : 
                  "bg-white/5 text-zinc-300"
                }`}>
                  {user.role}
                </Badge>
                <span className="text-sm font-medium text-zinc-400">{user.department}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 md:pb-2">
            {isSelf ? (
              <Link 
                href="/profile/edit"
                className="inline-flex items-center justify-center bg-white text-zinc-950 font-medium px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors text-sm"
              >
                Edit Profile
              </Link>
            ) : (
              <a 
                href={`mailto:${user.email}`}
                className="inline-flex items-center justify-center bg-amber-500 text-zinc-950 font-medium px-6 py-2 rounded-full hover:bg-amber-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </a>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-4 border-t border-white/5">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">About</h3>
              <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {user.bio || "No bio provided."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Details</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                {user.role === "FACULTY" && user.designation && (
                  <li className="flex items-center gap-3">
                    <BriefcaseIcon className="w-4 h-4 text-zinc-500" />
                    <span>{user.designation}</span>
                  </li>
                )}
                {user.role === "ALUMNI" && (
                  <>
                    {user.organization && (
                      <li className="flex items-center gap-3">
                        <BriefcaseIcon className="w-4 h-4 text-zinc-500" />
                        <span>{user.organization}</span>
                      </li>
                    )}
                    {user.graduationYear && (
                      <li className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>Class of {user.graduationYear}</span>
                      </li>
                    )}
                  </>
                )}
                {user.role === "STUDENT" && user.batch && (
                  <li className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>Batch {user.batch}</span>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>University of Chittagong</span>
                </li>
              </ul>
            </div>

            {socialLinks.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link, i) => (
                    <a 
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
