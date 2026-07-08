import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { skillCategories, skillsByCategory } from '@/lib/content';
import type { Profile, Skill } from '@/types';

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div className="group">
      <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
      <p className="max-w-[60ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}

export function AboutSection({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  const { about, location } = profile;

  const blocks = [
    { label: 'The journey', body: about.journey },
    { label: 'Right now', body: about.currentFocus },
    { label: 'How I work', body: about.philosophy },
    { label: 'Learning', body: about.learning },
  ].filter((b) => b.body.trim() !== '');

  const hasSkills = skillCategories.some((cat) => skillsByCategory(skills, cat).length > 0);
  const hasLocation = !!location?.trim();

  if (!blocks.length && !hasSkills && !hasLocation) return null;

  return (
    <SectionContainer id="about" width="wide">
      <SectionHeading eyebrow="About" title="A bit of background" />

      <div className="mt-14 grid gap-14 md:grid-cols-12 lg:gap-20">
        {blocks.length > 0 && (
          <Reveal className="space-y-10 md:col-span-7">
            {blocks.map((b) => (
              <Block key={b.label} label={b.label} body={b.body} />
            ))}
          </Reveal>
        )}

        {(hasSkills || hasLocation) && (
          <Reveal
            delay={80}
            className={
              blocks.length > 0
                ? 'md:col-span-5 md:border-l md:border-line md:pl-8 lg:pl-12'
                : 'md:col-span-12'
            }
          >
            <div className="space-y-8 md:sticky md:top-24">
              {hasSkills && (
                <div>
                  <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
                    Stack
                  </p>
                  <div className="space-y-5">
                    {skillCategories.map((cat) => {
                      const items = skillsByCategory(skills, cat);
                      if (!items.length) return null;
                      return (
                        <div key={cat}>
                          <div className="mb-1.5 text-[0.625rem] uppercase tracking-[0.16em] text-faint/60">
                            {cat}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                            {items.map((s, i) => (
                              <span key={s.name} className="text-sm text-ink">
                                {s.name}
                                {i < items.length - 1 && (
                                  <span className="ml-3 text-line" aria-hidden="true">·</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasLocation && (
                <div>
                  <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
                    Based in
                  </p>
                  <p className="text-sm text-ink">{location}</p>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </SectionContainer>
  );
}
