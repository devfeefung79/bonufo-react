import './About.css';

const sections = [
  {
    heading: "About BONUFO",
    description: "BONUFO is a free platform for English learner to practice their English writing skills. We aim to provide an affordable and convenient learning platform with satisfying experience."
  },
  {
    heading: "Common Q&As",
    subsections: [
      {
        subheading: "As a Learner",
        questions: [
          {
            label: "How do I find specific questions?"
          },
          {
            label: "How do I submit my work?"
          },
          {
            label: "How do my work be assessed?"
          }
        ]
      },
      {
        subheading: "As a Tutor",
        questions: [
          {
            label: "How do I assess learners' work?"
          }
        ]
      }
    ]
  },
]

function About() {
  return (
    <div>
      <span className='about-heading-text'>{sections[0].heading}</span>
      <p className='about-desp'>{sections[0].description}</p>
      <br />
      <span className='about-heading-text'>{sections[1].heading}</span>
      {sections[1].subsections.map((section) => <>
        <span className='about-subheading-text'>{section.subheading}</span>
        <ul>
          {section.questions.map((question) =>
            <li>{question.label}</li>
          )}
        </ul>
      </>)}
    </div>
  );
}

export default About;
