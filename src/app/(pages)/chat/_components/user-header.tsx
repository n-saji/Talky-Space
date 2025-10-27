import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function UserHeader({ recipient }: { recipient: User }) {
  if (!recipient) return null;
  return (
    <div className="flex flex-col w-full h-14 items-start justify-center">
      <div className="flex gap-x-2 items-center px-4 font-medium text-lg">
        <Avatar>
          <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {recipient.name}
      </div>
      <Separator orientation="horizontal" className="mx-2 mt-2" />
    </div>
  );
}
