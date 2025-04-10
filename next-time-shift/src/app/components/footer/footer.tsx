type Props = {
  name: string;
};

const Footer = ({ name }: Props) => {
  return (
    <footer className="fixed left-10 bottom-10">
      <p>{name} &copy; 2025</p>
    </footer>
  );
};

export default Footer;