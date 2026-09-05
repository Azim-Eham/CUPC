import Link from "next/link";
import { auth } from "@/lib/auth";
import { GraduationCap, Lock } from "lucide-react";
import { PublicNavbar } from "@/components/public-navbar";
import { AuthenticatedNavbar } from "@/components/authenticated-navbar";


// Hardcoded faculty list matching the homepage section
const faculty = [
  {
    "id": "fac-1",
    "name": "Dr. Md. Rafiqul Islam",
    "role": "Professor & Chairman",
    "designation": "Professor",
    "initials": "MI",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/390_8LLYLCZB3D.jpg"
  },
  {
    "id": "fac-2",
    "name": "Dr. Kazi Shamim Sultana",
    "role": "Professor",
    "designation": "Professor",
    "initials": "KS",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/391_FJZ0YIL8YO.jpg"
  },
  {
    "id": "fac-3",
    "name": "Dr AKM Moinul Haque Meaze",
    "role": "Professor",
    "designation": "Professor",
    "initials": "DM",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/51_1H6DNZ4YDL.jpg"
  },
  {
    "id": "fac-4",
    "name": "Professor Dr. Mohammed Nasim Hasan",
    "role": "Professor",
    "designation": "Professor",
    "initials": "MH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/392_YPGWUGVVZY.jpg"
  },
  {
    "id": "fac-5",
    "name": "Dr. Shyamal Ranjan Chakraborty",
    "role": "Professor",
    "designation": "Professor",
    "initials": "SC",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/393_18J9UMOXD5.jpg"
  },
  {
    "id": "fac-6",
    "name": "Dr. S. M. Khorshed Alam",
    "role": "Professor",
    "designation": "Professor",
    "initials": "SA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/394_P9NT5987J8.jpg"
  },
  {
    "id": "fac-7",
    "name": "Dr. Mohammad Idrish Miah",
    "role": "Professor",
    "designation": "Professor",
    "initials": "MM",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/395_V7THBR65SJ.jpg"
  },
  {
    "id": "fac-8",
    "name": "Dr. Rezaul Azim",
    "role": "Professor",
    "designation": "Professor",
    "initials": "RA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/397_N3R193I57S.jpg"
  },
  {
    "id": "fac-9",
    "name": "Dr. Shahida Akhter",
    "role": "Professor",
    "designation": "Professor",
    "initials": "SA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/398_RLVXG4EAMB.jpg"
  },
  {
    "id": "fac-10",
    "name": "Dr. A. K. M. Rezaur Rahman",
    "role": "Professor",
    "designation": "Professor",
    "initials": "AR",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/400_8PRD0XJAF4.jpg"
  },
  {
    "id": "fac-11",
    "name": "Dr. A. K. M. Ariful Haque Siddique",
    "role": "Professor",
    "designation": "Professor",
    "initials": "AS",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/401_ASGE7LYIH8.jpg"
  },
  {
    "id": "fac-12",
    "name": "Dr. Neelufar Panna",
    "role": "Professor",
    "designation": "Professor",
    "initials": "NP",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/399_JOGWDR7ET2.jpg"
  },
  {
    "id": "fac-13",
    "name": "Mr. Mohammad Asadul Haque",
    "role": "Professor",
    "designation": "Professor",
    "initials": "MH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/402_0JBGWHUT5M.jpg"
  },
  {
    "id": "fac-14",
    "name": "Dr. Shamima Nasrin",
    "role": "Professor",
    "designation": "Professor",
    "initials": "SN",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/405_CB7P06NMB9.jpg"
  },
  {
    "id": "fac-15",
    "name": "Dr. Quazi Muhammad Rashed-Nizam",
    "role": "Professor",
    "designation": "Professor",
    "initials": "QR",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/406_UYZRXTEE4F.jpg"
  },
  {
    "id": "fac-16",
    "name": "Mr. Nur Mohammad Eman",
    "role": "Associate Professor",
    "designation": "Associate Professor",
    "initials": "NE",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/407_MTGE8J34ED.jpg"
  },
  {
    "id": "fac-17",
    "name": "Dr. Md Kowsar Alam",
    "role": "Professor",
    "designation": "Professor",
    "initials": "MA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/409_X58I0WNSAT.jpg"
  },
  {
    "id": "fac-18",
    "name": "Dr. Md. Saiful Alam",
    "role": "Associate Professor",
    "designation": "Associate Professor",
    "initials": "MA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/412_CO173X62QS.jpg"
  },
  {
    "id": "fac-19",
    "name": "Mr. Md. Mohsin",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "MM",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/408_85GSI07CVR.jpg"
  },
  {
    "id": "fac-20",
    "name": "Miss. Shamsun Alam",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "SA",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/411_DA05JUKQUC.jpg"
  },
  {
    "id": "fac-21",
    "name": "Mohammad Shahjahan",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "MS",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/415_X20LG7SR36.jpg"
  },
  {
    "id": "fac-22",
    "name": "Dr. Mohammad Ashraful Islam",
    "role": "Associate Professor",
    "designation": "Associate Professor",
    "initials": "MI",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/410_O5FY484512.jpg"
  },
  {
    "id": "fac-23",
    "name": "Syeda Karimunnesa",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "SK",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/960_7MT3GIOCUX.jpg"
  },
  {
    "id": "fac-24",
    "name": "Dr Santunu Purohit",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "DP",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/413_G47DCDNTYR.jpg"
  },
  {
    "id": "fac-25",
    "name": "Mohammad Nasirul Hoque",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "MH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/967_R0J68D0VTF.jpg"
  },
  {
    "id": "fac-26",
    "name": "Sadeka Sultana Rubai",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "SR",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/968_GYG8DYSML6.jpg"
  },
  {
    "id": "fac-27",
    "name": "Dr. Muhammad Moazzam Hossen",
    "role": "Assistant Professor",
    "designation": "Assistant Professor",
    "initials": "MH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/1242_N93A38E4RL.jpg"
  },
  {
    "id": "fac-28",
    "name": "Abdullah Al Mamun",
    "role": "Lecturer",
    "designation": "Lecturer",
    "initials": "AM",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/1244_TIIXI7P8SL.jpg"
  },
  {
    "id": "fac-29",
    "name": "Mr. Abu Hayat",
    "role": "Lecturer",
    "designation": "Lecturer",
    "initials": "AH",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/1238_HMTCHKXDDL.jpg"
  },
  {
    "id": "fac-30",
    "name": "Afroja Tazin Islam",
    "role": "Lecturer",
    "designation": "Lecturer",
    "initials": "AI",
    "imageUrl": "https://cu.ac.bd/assets/image/faculty_staff_users/profile_pic.png"
  }
]

export default async function FacultyDirectoryPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated ? <AuthenticatedNavbar session={session} /> : <PublicNavbar />}
      <main className="flex-1 pb-16 md:pb-0 min-h-screen bg-surface-base font-sans">
      <div className="bg-surface-navy w-full py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-[#f2a93c]"></div>
             <span className="text-text-inverse-muted text-xs font-medium uppercase tracking-wider">Department of Physics</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-inverse mb-4">Faculty Members</h1>
          <p className="text-text-inverse-muted text-lg max-w-xl">
            Learn from the brilliant minds shaping the future of physics at the University of Chittagong.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {!isAuthenticated ? (
          <div className="text-center py-24 bg-surface-alt rounded-2xl border border-dashed border-[#e2e2ea]">
            <Lock className="w-12 h-12 text-[#f2a93c] mx-auto mb-4 opacity-80" />
            <p className="text-text-primary font-bold text-xl mb-2">Faculty directory is private</p>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">Please log in to view our faculty directory and connect with department members.</p>
            <Link href="/login?from=/faculty" className="inline-flex items-center justify-center bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Log in to view faculty
            </Link>
          </div>
        ) : faculty.length === 0 ? (
          <div className="text-center py-24 bg-surface-alt rounded-2xl border border-dashed border-[#e2e2ea]">
            <GraduationCap className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-text-primary font-bold text-lg">No faculty members found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => {
               return (
                <div key={member.id} className="bg-surface-card border border-[#e2e2ea] rounded-2xl p-6 flex flex-col h-full hover:shadow-[0_4px_20px_-2px_rgba(18,23,46,0.05)] transition-shadow text-center items-center">
                  
                  {member.imageUrl ? (
                     <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full object-cover shadow-sm mb-4 bg-surface-alt" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#12172e] flex items-center justify-center text-3xl font-bold text-text-inverse mb-4 shadow-sm">
                      {member.initials}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-[#f2a93c]">{member.designation}</p>

                  <div className="pt-6 mt-auto w-full">
                    {!isAuthenticated ? (
                      <Link href={`/login`} className="w-full flex items-center justify-center bg-surface-alt hover:bg-neutral-200 text-brand-navy font-semibold py-3 rounded-full transition-colors">
                        Log in to connect
                      </Link>
                    ) : (
                      <Link href={`/faculty/${member.id}`} className="w-full flex items-center justify-center bg-surface-alt hover:bg-neutral-200 text-brand-navy font-semibold py-3 rounded-full transition-colors">
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
