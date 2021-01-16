import * as Feather from "react-feather";

export default function Icon({ name, ...rest }) {
  const Icon = Feather[name];
  return <Icon {...rest} />;
}
