import { CelebrityCard } from './CelebrityCard';
import { Person } from '../types/person';

type Props = {
  people: Person[];
};

export default function PeopleGrid({ people }: Props) {
  return (
    <div className="flex overflow-x-auto space-x-4 px-2 sm:px-4 lg:px-8 py-2">
      {people.map((person) => (
        <div
          key={person.id}
          className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[280px]"
        >
          <CelebrityCard person={person} />
        </div>
      ))}
    </div>
  );
}
