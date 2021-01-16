import { CheckCircle } from "react-feather";

interface Attributes {
  title: string;
  pros: string[];
}

export default function ProsCard({ title, pros }: Attributes) {
  return (
    <div className="border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900 rounded p-6 my-4 w-full">
      <span>{title}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="flex font-medium items-baseline mb-2">
            <div className="h-4 w-4 mr-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <span>{pro}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
