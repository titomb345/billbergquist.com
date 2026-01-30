import GlowText from '../components/ui/GlowText';
import ExperienceTimeline from '../components/about/ExperienceTimeline';
import SkillsSection from '../components/about/SkillsSection';
import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <GlowText size="large" color="cyan" animated className={styles.title}>
          ABOUT ME
        </GlowText>
        <p className={styles.summary}>
          I'm a Staff Software Engineer with over 14 years of experience
          building web applications. My focus is on frontend technologies,
          internal tooling, and creating developer experiences that help teams
          ship faster and more confidently.
        </p>
        <p className={styles.summary}>
          Currently at Kasa, I lead frontend architecture initiatives and build
          tools that accelerate development across the organization. I'm
          passionate about clean code, great user experiences, and helping other
          engineers grow.
        </p>
      </header>

      <main className={styles.content}>
        <ExperienceTimeline />
        <SkillsSection />

        <section className={styles.education}>
          <GlowText
            as="h2"
            size="medium"
            color="purple"
            className={styles.sectionTitle}
          >
            EDUCATION
          </GlowText>
          <div className={styles.educationCard}>
            <h3 className={styles.school}>Purdue University</h3>
            <p className={styles.degree}>BS Computer Engineering</p>
            <p className={styles.years}>2006 - 2010</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
