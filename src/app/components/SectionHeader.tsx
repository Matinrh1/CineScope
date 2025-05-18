import Link from "next/link";
import { RippleButton } from "./RippleButton";

export default function SectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="flex px-6 justify-between items-center pb-6 pt-15 ">
      <h2 className="text-2xl sm:text-4xl text-white pb-1  font-semibold">{title}</h2>
        <Link href={href}>
          <RippleButton className="text-blue-400 px-2  border-1 border-blue-500 hover:border-blue-400 rounded-full ">
            See All
          </RippleButton>
        </Link>
      
    </div>
  );
}
