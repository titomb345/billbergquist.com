import GlowText from '../ui/GlowText';
import styles from './ExperienceTimeline.module.css';

interface Experience {
  company: string;
  title: string;
  period: string;
  description?: string;
}

const experiences: Experience[] = [
  {
    company: 'Kasa',
    title: 'Staff Software Engineer',
    period: 'Oct 2023 - Present',
    description:
      'Leading frontend architecture and internal tooling initiatives. Building developer experiences that accelerate team productivity.',
  },
  {
    company: 'Kasa',
    title: 'Senior Software Engineer',
    period: 'Mar 2022 - Oct 2023',
    description:
      'Developed core platform features and mentored junior engineers on frontend best practices.',
  },
  {
    company: 'Kasa',
    title: 'Software Engineer III',
    period: 'Jan 2020 - Mar 2022',
    description:
      'Built and maintained React applications for hospitality management platform.',
  },
  {
    company: 'Evite',
    title: 'Software Engineer III',
    period: '2019 - 2020',
  },
  {
    company: 'Varius Solutions',
    title: 'Software Engineer',
    period: '2018 - 2019',
  },
  {
    company: 'RevCascade',
    title: 'Software Engineer',
    period: '2016 - 2018',
  },
  {
    company: 'NRG Home Solar',
    title: 'Software Engineer',
    period: '2015 - 2016',
  },
  {
    company: 'GumGum',
    title: 'Software Engineer',
    period: '2014 - 2015',
  },
  {
    company: 'PriceGrabber',
    title: 'Software Engineer',
    period: '2011 - 2014',
  },
];

function ExperienceTimeline() {
  return (
    <section className={styles.section}>
      <GlowText
        as="h2"
        size="medium"
        color="magenta"
        className={styles.sectionTitle}
      >
        EXPERIENCE
      </GlowText>
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.marker} />
            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.company}>{exp.company}</h3>
                <span className={styles.period}>{exp.period}</span>
              </div>
              <p className={styles.title}>{exp.title}</p>
              {exp.description && (
                <p className={styles.description}>{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExperienceTimeline;
