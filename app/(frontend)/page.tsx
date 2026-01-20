
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
      <div id="work">
        <Work />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="education">
        <Education />
      </div>
      <div id="techstack">
        <TechStack />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </main>
  )
}
