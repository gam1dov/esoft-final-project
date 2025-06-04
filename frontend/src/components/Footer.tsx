const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear} NEWB. Все права защищены
      </div>
    </footer>
  );
};
export default Footer;
