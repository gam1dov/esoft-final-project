import logo from "../../assets/logo.svg";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <img className={`${className} object-contain`} src={logo} alt="NEWB logo" />
  );
};
export default Logo;
