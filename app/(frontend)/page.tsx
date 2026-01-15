
import Hero from './sections/hero';
import Work from './sections/work';
import Experience from './sections/experience';
import Education from './sections/education';
import TechStack from './sections/techstack';
import Contact from './sections/contact';


export default function Home() {
  return (
    <main className='px-4'>
      <Hero />
      <Work />
      <Experience />
      <Education />
      <TechStack />
      <Contact />
    </main>
  )
}
