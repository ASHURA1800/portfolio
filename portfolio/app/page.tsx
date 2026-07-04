import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { BuildLogSection } from "@/components/sections/BuildLogSection";
import { LearningsSection } from "@/components/sections/LearningsSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  getProfile,
  getSkills,
  getExperience,
  getFeaturedProjects,
  getBuildLog,
  getLearnings,
  getRoadmap,
  skillCategories,
  skillsByCategory,
} from "@/lib/content";
import { getSocials } from "@/lib/content/socials";

// Content is DB-driven. ISR: prerendered at build, revalidated every 60s so
// admin edits appear without a redeploy.
export const revalidate = 60;

export default async function Home() {
  const [profile, skills, experience, projects, buildLog, learnings, roadmap] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getExperience(),
      getFeaturedProjects(),
      getBuildLog(),
      getLearnings(),
      getRoadmap(),
    ]);

  const socials = getSocials(profile);
  const brand = profile.name || profile.username || "Portfolio";

  // Compute which sections have real content so nav links stay accurate.
  const aboutBlocks = [
    profile.about.journey,
    profile.about.currentFocus,
    profile.about.philosophy,
    profile.about.learning,
  ].some((b) => b.trim() !== '');
  const hasAbout =
    aboutBlocks ||
    skillCategories.some((cat) => skillsByCategory(skills, cat).length > 0) ||
    !!profile.location.trim();
  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0 || !!profile.currentWork.trim();
  // Certifications are fetched client-side — include the link optimistically.
  const hasCertifications = true;

  const visibleSections = [
    hasAbout && '#about',
    hasProjects && '#projects',
    hasExperience && '#experience',
    hasCertifications && '#certifications',
    '#contact',
  ].filter(Boolean) as string[];

  return (
    <>
      <Navbar brand={brand} socials={socials} visibleSections={visibleSections} />
      <main>
        <HeroSection profile={profile} socials={socials} />
        <AboutSection profile={profile} skills={skills} />
        <ProjectsSection projects={projects} githubUrl={profile.github} />
        <SkillsSection skills={skills} skillsNote={profile.skillsNote} />
        <ExperienceSection experience={experience} currentWork={profile.currentWork} />
        {/* These three render only once their tables have real entries. */}
        <BuildLogSection entries={buildLog} />
        <LearningsSection learnings={learnings} />
        <RoadmapSection roadmap={roadmap} />
        <CertificationsSection />
        <ContactSection profile={profile} socials={socials} />
      </main>
      <Footer profile={profile} socials={socials} />
    </>
  );
}
