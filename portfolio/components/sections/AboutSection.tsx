import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { skillCategories, skillsByCategory } from '@/lib/content';
import type { Profile, Skill } from '@/types';

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent-700">
        {label}
      </h3>
      <p className="max-w-[60ch] text-lg leading-relaxed text-muted">{body}</p>
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
      <SectionHeading eyebrow="About" title="A bit of" highlight="background" />

      <div className="mt-14 grid gap-12 md:grid-cols-12 lg:gap-16">
        {blocks.length > 0 && (
          <Reveal className="space-y-10 md:col-span-7">
            {blocks.map((b) => (
              <Block key={b.label} label={b.label} body={b.body} />
            ))}
          </Reveal>
        )}

        {(hasSkills || hasLocation) && (
          <aside
            className={
              blocks.length > 0
                ? 'md:col-span-5 md:border-l md:border-line md:pl-6 lg:pl-10'
                : 'md:col-span-12'
            }
          >
            <div className="space-y-8 md:sticky md:top-24">
              {hasSkills && (
                <div>
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-accent-700">
                    Stack
                  </h3>
                  <div className="space-y-4">
                    {skillCategories.map((cat) => {
                      const items = skillsByCategory(skills, cat);
                      if (!items.length) return null;
                      return (
                        <div key={cat}>
                          <div className="mb-1 text-xs uppercase tracking-[0.14em] text-faint">
                            {cat}
                          </div>
                          <div className="text-[15px] text-ink">
                            {items.map((s) => s.name).join('  ·  ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasLocation && (
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-700">
                    Based in
                  </h3>
                  <p className="text-[15px] text-ink">{location}</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </SectionContainer>
  );
}
