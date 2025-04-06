type Props = {
  name: string;
};

const Footer = ({ name }: Props) => {
  return (
    <footer>
      <p>{name} &copy; 2025</p>
    </footer>
  );
};

export default Footer;