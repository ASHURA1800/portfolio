import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/ui/SkipLink";
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
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
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

  // Rotating hero titles: profile.title first, then distinct experience roles.
  const heroRoles = Array.from(
    new Set([profile.title, ...experience.map((e) => e.role)].filter(Boolean)),
  );

  // Years of experience, derived from earliest experience start_date.
  const earliestStart = experience.reduce<number | null>((min, e) => {
    const year = new Date(e.start_date).getFullYear();
    if (Number.isNaN(year)) return min;
    return min === null ? year : Math.min(min, year);
  }, null);
  const yearsExperience = earliestStart
    ? Math.max(1, new Date().getFullYear() - earliestStart)
    : null;

  const heroStats = [
    yearsExperience !== null && { value: yearsExperience, suffix: '+', label: 'Years experience' },
    projects.length > 0 && { value: projects.length, suffix: '+', label: 'Projects shipped' },
    skills.length > 0 && { value: skills.length, suffix: '+', label: 'Technologies' },
  ].filter(Boolean) as { value: number; suffix?: string; label: string }[];

  const visibleSections = [
    hasAbout && '#about',
    hasProjects && '#projects',
    hasExperience && '#experience',
    hasCertifications && '#certifications',
    '#contact',
  ].filter(Boolean) as string[];

  return (
    <>
      <PersonJsonLd profile={profile} socials={socials} />
      <SkipLink />
      <Navbar brand={brand} socials={socials} visibleSections={visibleSections} resume={profile.resume} />
      <main id="main-content">
        <HeroSection
          profile={profile}
          socials={socials}
          roles={heroRoles}
          stats={heroStats}
        />
        <AboutSection profile={profile} skills={skills} experience={experience} stats={heroStats} />
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
