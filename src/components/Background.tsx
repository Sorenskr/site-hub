import ParticleField from "./ParticleField";
import BackgroundMedia from "./BackgroundMedia";

export default function Background() {
  return (
    <>
      <ParticleField />
      <BackgroundMedia />
      <div className="aurora-grid" aria-hidden />
    </>
  );
}
