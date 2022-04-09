import * as Feather from "react-icons/fi";

export default function Icon({ name, ...rest }) {
  const Icon = Feather[name];
  return <Icon {...rest} />;
}
