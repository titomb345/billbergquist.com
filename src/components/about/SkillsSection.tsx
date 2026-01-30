import GlowText from '../ui/GlowText';
import styles from './SkillsSection.module.css';

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'Vue', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Libraries & Frameworks',
    skills: ['NX', 'MUI', 'Tailwind', 'Redux', 'React Query', 'Vite'],
  },
  {
    name: 'Backend & Cloud',
    skills: ['Node.js', 'AWS', 'REST APIs', 'GraphQL'],
  },
  {
    name: 'Tools & Practices',
    skills: ['Git', 'CI/CD', 'Testing', 'Agile', 'Code Review'],
  },
];

function SkillsSection() {
  return (
    <section className={styles.section}>
      <GlowText
        as="h2"
        size="medium"
        color="cyan"
        className={styles.sectionTitle}
      >
        SKILLS
      </GlowText>
      <div className={styles.categories}>
        {skillCategories.map((category) => (
          <div key={category.name} className={styles.category}>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <div className={styles.skills}>
              {category.skills.map((skill) => (
                <span key={skill} className={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
