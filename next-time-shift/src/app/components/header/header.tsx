type Props = {
  title: string;
  subtitle: string;
  description: string;
};

export default function Header({ title, subtitle, description }: Props) {
  return (
    <header className="text-center">
      <h1 className="font-4xl">{title}</h1>
      <h2 className="font-2xl text-accent">{subtitle}</h2>
      <h3 className="font-xl text-text2">{description}</h3>
    </header>
  );
}

