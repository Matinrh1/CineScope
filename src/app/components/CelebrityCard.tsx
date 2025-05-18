'use client';

import { useRouter } from 'next/navigation';
import { RippleButton } from './RippleButton';

export function CelebrityCard({ person }: { person: any }) {
  const router = useRouter();


  const handleClick = () => {
    router.push(`/celebrities/${person.id}`);
  };

  return (
    <RippleButton onClick={handleClick} className="cursor-pointer">
      <div className="rounded overflow-hidden shadow hover:brightness-110 transition">
        <img
          src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
          alt={person.name}
          className="w-full h-auto"
        />
        <div className="p-2 text-center">
          <p className="font-semibold sm:py-3 md:text-lg text-white">{person.name}</p>
        </div>
      </div>
    </RippleButton>
  );
}
