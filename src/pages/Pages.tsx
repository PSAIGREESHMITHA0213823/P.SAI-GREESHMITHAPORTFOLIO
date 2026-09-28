import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { PageLevel } from '../components/Primitives';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { About as AboutSection } from '../sections/About';
import { Contact as ContactSection } from '../sections/Contact';
import { ServicesPage as ServicesContent } from '../sections/ServicesPage';
import { Experience } from '../sections/Experience';
import { ProjectExplorer } from '../sections/ProjectExplorer';
import { Skills } from '../sections/Skills';
import { Achievements, Certifications } from '../sections/Work';
import { scrollToSection } from '../utils/navigation';
import { CtaBand } from './Home';

/** Scrolls to #section after navigating to a page (palette, shortcuts, shared links). */
function useHashScroll() {
  const { hash, key } = useLocation();
  useEffect(() => {
    const id = hash.slice(1);
    if (!id) return;
    const raf = requestAnimationFrame(() => scrollToSection(id, false));
    return () => cancelAnimationFrame(raf);
  }, [hash, key]);
}

export function WorkPage() {
  useDocumentMeta('Work', 'Projects by P.SAI GREESHMITHA: AI systems, SaaS platforms, and healthcare, education and business software.');
  useHashScroll();
  return (
    <div className="page">
      <PageLevel.Provider value={1}>
        <ProjectExplorer />
      </PageLevel.Provider>
      <CtaBand />
    </div>
  );
}

export function AboutPage() {
  useDocumentMeta('About', 'About P.SAI GREESHMITHA: education, internships, skills, achievements and certifications.');
  useHashScroll();
  return (
    <div className="page">
      <PageLevel.Provider value={1}>
        <AboutSection />
      </PageLevel.Provider>
      <Experience />
      <Skills />
      <Achievements />
      <Certifications />
      <CtaBand />
    </div>
  );
}

export function ServicesPage() {
  useDocumentMeta('Services', 'Web, full-stack, SaaS, AI, business, education and healthcare software development.');
  return (
    <div className="page">
      <ServicesContent />
      <CtaBand />
    </div>
  );
}

export function ContactPage() {
  useDocumentMeta('Contact', 'Get in touch with P.SAI GREESHMITHA about a software project.');
  return (
    <div className="page">
      <PageLevel.Provider value={1}>
        <ContactSection />
      </PageLevel.Provider>
    </div>
  );
}
