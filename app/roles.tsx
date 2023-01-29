"use client";

import { useScramble } from "use-scramble";
import { useEffect, useState } from "react";

const roles = [
  "Software Engineer",
  "Web Developer",
  "UI/UX Designer",
  "Open Source Contributor",
  "IoT/Embedded Enthusiast",
  "AI/ML Enthusiast",
  "Tech Enthusiast",
  "Crypto Bro",
  "Tinkerer",
  "Student",
  "Learner",
  "Hacker",
  "Maker",
  "Gamer",
  "Nerd",
];

function* randomRole(): Generator<string> {
  // shuffle array
  const shuffled = roles.sort(() => 0.5 - Math.random());

  let i = 0;

  while (true) {
    yield shuffled[i];
    i = (i + 1) % shuffled.length;
  }
}

export default function RoleScramble() {
  const [role, setRole] = useState<string>(randomRole().next().value);
  const { ref } = useScramble({
    text: role,
    overdrive: false,
    // unicode: 33, 35, 36, 37, 38, 42, 43, 45, 48-57, 61, 63, 64, 65-90, 97-122, 126
    // charset:  !,  #,  $,  %,  &,  *,  +,  -,   0-9,  =,  ?,  @,   A-Z,    a-z,   ~
    range: [
      33, 35, 36, 37, 38, 42, 43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
      113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 126,
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRole(randomRole().next().value);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span ref={ref} className="font-mono italic text-gray-400">
      Web Developer
    </span>
  );
}
