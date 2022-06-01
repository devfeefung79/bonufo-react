import './About.css';

function About() {
  return (
    <div>
      <span className='about-heading-text'>About BONUFO</span>
      <p className='about-desp'>BONUFO is a free platform for English learner to practice their English writing skills. We aim to provide an affordable and convenient learning platform with satisfying experience.</p>
      <br />
      <span className='about-heading-text'>Common Q&As</span>
      <span className='about-subheading-text'>As a Learner</span>
      <ul>
        <li>How do I find specific questions?</li>
        <li>How do I submit my work?</li>
        <li>How do my work be assessed?</li>
      </ul>
      <span className='about-subheading-text'>As a Tutor</span>
      <ul>
        <li>How do I assess learners' work?</li>
      </ul>
    </div>
  );
}

export default About;
