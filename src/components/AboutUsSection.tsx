import useScrollAnimation from "@/hooks/useScrollAnimation";
import useCountUp from "@/hooks/useCountUp";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed", type: "bar" },
  { value: 8, suffix: "+", label: "Years Experience", type: "line" },
  { value: 50, suffix: "+", label: "Happy Clients", type: "pie" },
  { value: 15, suffix: "", label: "Team Members", type: "bar" },
];

const barData = [
  { name: '2020', value: 20 },
  { name: '2021', value: 45 },
  { name: '2022', value: 80 },
  { name: '2023', value: 120 },
  { name: '2024', value: 150 },
];

const lineData = [
  { year: '2017', value: 1 },
  { year: '2019', value: 3 },
  { year: '2021', value: 5 },
  { year: '2023', value: 7 },
  { year: '2025', value: 8 },
];

const pieData = [
  { name: 'Satisfied', value: 50 },
  { name: 'Remaining', value: 10 },
];

const teamBarData = [
  { dept: 'Design', value: 5 },
  { dept: 'Dev', value: 6 },
  { dept: 'Strategy', value: 4 },
];

const CHART_COLORS = ['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.2)'];

interface StatCardProps {
  stat: typeof stats[0];
  index: number;
  isVisible: boolean;
}

const StatCard = ({ stat, index, isVisible }: StatCardProps) => {
  const count = useCountUp({
    end: stat.value,
    duration: 2500,
    enabled: isVisible,
  });

  const renderChart = () => {
    switch (stat.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={index === 0 ? barData : teamBarData}>
              <Bar
                dataKey="value"
                fill="rgba(139, 92, 246, 0.6)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={lineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth={2}
                dot={{ fill: 'rgba(139, 92, 246, 1)', strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={25}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="text-center md:text-left transition-all duration-700 p-4 rounded-lg"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${0.5 + index * 0.15}s`,
      }}
    >
      {/* Mini Chart */}
      <div className="mb-3 opacity-80">
        {renderChart()}
      </div>
      
      {/* Animated Number */}
      <p
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
        style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        {count}{stat.suffix}
      </p>
      <p
        className="text-xs md:text-sm tracking-[0.15em] uppercase"
        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
      >
        {stat.label}
      </p>
    </div>
  );
};

const AboutUsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8"
      style={{ background: '#0a0a0a' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs md:text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700"
            style={{
              color: 'rgba(139, 92, 246, 0.8)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            About Us
          </p>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '0.1s',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            We craft digital experiences
            <br />
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>that inspire and engage</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Left Column - Main Description */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
            }}
          >
            <p
              className="text-lg md:text-xl leading-relaxed mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Maxora is a creative studio dedicated to pushing the boundaries of digital design. 
              We believe in the power of visual storytelling to transform brands and create 
              meaningful connections with audiences.
            </p>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Founded with a passion for innovation, our team combines strategic thinking with 
              artistic excellence to deliver projects that not only look stunning but also 
              drive real results for our clients.
            </p>
          </div>

          {/* Right Column - Mission & Vision */}
          <div
            className="space-y-8 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
            }}
          >
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-3"
                style={{ color: 'rgba(139, 92, 246, 0.8)' }}
              >
                Our Mission
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                To empower brands with bold, innovative design solutions that captivate 
                audiences and drive meaningful engagement in the digital age.
              </p>
            </div>
            <div>
              <h3
                className="text-sm tracking-[0.2em] uppercase mb-3"
                style={{ color: 'rgba(139, 92, 246, 0.8)' }}
              >
                Our Vision
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                To be the creative force that shapes the future of digital experiences, 
                setting new standards for design excellence and innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid with Charts */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-12 border-t"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
