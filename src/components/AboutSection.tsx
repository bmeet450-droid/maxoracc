const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="relative min-h-screen p-8 md:p-16"
      style={{ background: '#000000' }}
    >
      <div className="w-64 md:w-80 aspect-video rounded-2xl overflow-hidden shadow-xl">
        <iframe
          src="https://www.youtube.com/embed/mv-g2qryw5U"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </section>
  );
};

export default AboutSection;
