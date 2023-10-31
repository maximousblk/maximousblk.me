import ThemeSwitch from "@/components/ThemeSwitch";
import NavWrapper from "@/components/NavWrapper";
import NavLink from "@/components/NavLink";
import config from "@/config";

export default function Navbar() {
  return (
    <NavWrapper>
      <div className="flex w-full max-w-6xl flex-nowrap items-center justify-between">
        <div className="flex flex-shrink-0 space-x-0 md:space-x-2">
          {config.nav.map(({ name, emoji, href }, i) => (
            <NavLink emoji={emoji} name={name} href={href} key={i} />
          ))}
        </div>
        <ThemeSwitch />
      </div>
    </NavWrapper>
  );
}
