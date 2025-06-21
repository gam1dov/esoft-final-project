import logo from "../../assets/logo.svg";

type LogoProps = {
  className?: string;
};

// "h-12 w-12 object-contain"

const Logo = ({ className }: LogoProps) => {
  return (
    <img className={`${className} object-contain`} src={logo} alt="NEWB logo" />
  );
};
export default Logo;
