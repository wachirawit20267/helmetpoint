import HelmetLogo from "./HelmetLogo";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <HelmetLogo size={size} showText={true} />;
}
