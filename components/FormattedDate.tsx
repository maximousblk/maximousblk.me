import { format, parseISO } from "date-fns";

export function FormattedDate({ start, end }) {
  if (!start) return null;

  start = parseISO(start);
  end = end ? parseISO(end) : null;

  const hasTime = (d: Date) => d.getHours() !== 0;
  const withTime = (d: Date) => format(d, "PPpp");
  const withoutTime = (d: Date) => format(d, "PP");

  return (
    <time dateTime={start.toISOString()}>
      {hasTime(start) ? withTime(start) : withoutTime(start)}
      {end ? ` -> ${hasTime(end) ? withTime(end) : withoutTime(end)}` : ""}
    </time>
  );
}

export default FormattedDate;
