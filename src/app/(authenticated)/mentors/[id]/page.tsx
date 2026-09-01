import { redirect } from "next/navigation";

export default function OldMentorRoute({ params }: { params: { id: string } }) {
  redirect(`/profile/${params.id}`);
}
