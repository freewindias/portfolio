
import Contact from './sections/contact';
import Education from './sections/education';
import Experience from './sections/experience';
import Hero from './sections/hero';
import TechStack from './sections/techstack';
import Work from './sections/work';


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
