import Button from 'app/components/Button';
import PageTitle from 'app/components/PageTitle';

export default function ResumePage() {
  return (
    <section>
      <PageTitle>Resume</PageTitle>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto bg-background-content rounded-lg p-8 mb-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-heading mb-2">
            Weston Mossman
          </h1>
          <h2 className="mb-4 text-xl text-light-faded-turquoise">
            Senior Full Stack Software Engineer & Creative Consultant
          </h2>
          <div className="mb-4 flex flex-wrap justify-center items-center gap-4 text-sm text-text-primary">
            Santa Cruz, CA
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-primary">
            <a
              href="mailto:weston@westonmossman.com"
              className="text-faded-turquoise hover:underline hover:text-light-faded-turquoise"
            >
              weston@westonmossman.com
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/westonmossman"
              className="text-faded-turquoise hover:underline hover:text-light-faded-turquoise"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="https://github.com/wmossman"
              className="text-faded-turquoise hover:underline hover:text-light-faded-turquoise"
            >
              GitHub
            </a>
          </div>
        </header>

        {/* Experience Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">
            Experience
          </h3>

          {/* Creative Consultant */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">
                  Creative Consultant
                </h4>
                <p className="text-light-faded-turquoise font-medium">
                  Freelance
                </p>
              </div>
              <span className="text-text-primary">2022 - Present</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Provided creative direction and technical consulting for digital
                & physical art and media projects
              </li>
              <li>
                Developed custom software solutions for interactive
                installations and performances
              </li>
              <li>
                Collaborated with artists and organizations to bring innovative
                digital experiences to life
              </li>
              <li>
                Managed end-to-end project delivery from concept to sale to
                deployment
              </li>
            </ul>
          </div>

          {/* Founder */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Founder</h4>
                <p className="text-light-faded-turquoise font-medium">
                  Liminal Space Collective
                </p>
              </div>
              <span className="text-text-primary">2021 - 2025</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Launched & scaled social & sustainability focused interactive
                art co-op delivering immersive art-tech experiences by 200+
                multimedia creators, thousands of participants.
              </li>
              <li>
                Secured sales, grants, partnerships, enabled dynamic sustainable
                interactive projects & innovation incubators.
              </li>
              <li>
                ~$80k in event, membership, sponsorship, and grant income,
                spread through the creative community.
              </li>
              <li>
                Managed team of 13 division leaders and ~50 builders, producers
                and coordinators, now passed on to general management team.
              </li>
            </ul>
          </div>

          {/* Staff Front End Engineer */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">
                  Staff Front End Engineer
                </h4>
                <p className="text-light-faded-turquoise font-medium">Hippo</p>
              </div>
              <span className="text-text-primary">2018 - 2022</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Led Angular monolith → modern React/TypeScript/GraphQL
                micro-FE/BFF architecture, reducing TTI by 90%
              </li>
              <li>
                Led PM-controlled policy sales flow config & rendering system,
                5x product agility, reduced dev hours & regressions
              </li>
              <li>
                Led UI initiatives, hiring, templates, components, BDD,
                architecture, conventions, from startup through IPO
              </li>
            </ul>
          </div>

          {/* Full Stack Software Engineer */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">
                  Full Stack Software Engineer
                </h4>
                <p className="text-light-faded-turquoise font-medium">
                  eBay Inc.
                </p>
              </div>
              <span className="text-text-primary">2016 - 2018</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Supported Search Results app Java → Node.js migration,
                spellcheck UX, flexbox, PWA, accessibility standards
              </li>
            </ul>
          </div>

          {/* Front End Software Engineer */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">
                  Front End Software Engineer
                </h4>
                <p className="text-light-faded-turquoise font-medium">Yahoo!</p>
              </div>
              <span className="text-text-primary">2015 - 2016</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Supported Yahoo! Finance React/Fluxible migration, sticky nav,
                cross-browser styling, instrumentation, TDD
              </li>
            </ul>
          </div>

          {/* Software Engineer */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">
                  Software Engineer Intern
                </h4>
                <p className="text-light-faded-turquoise font-medium">
                  Survey Monkey
                </p>
              </div>
              <span className="text-text-primary">2013 - 2014</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Built Search Function for 'Create' Product using ES5, JQuery and
                Pyramid framework
              </li>
              <li>Implemented automated testing and CI/CD pipelines</li>
              <li>Maintained internal admin tooling</li>
            </ul>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">
            Skills
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-text-heading mb-3">
                Technical Skills
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-text-heading">
                    Frontend:
                  </span>
                  <span className="text-text-primary ml-2">
                    React, Hooks, TypeScript, Next.js, JavaScript, ES6/ESM,
                    HTML5, CSS3, Tailwind CSS, Storybook, Redux, Zustand
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">
                    Backend:
                  </span>
                  <span className="text-text-primary ml-2">
                    Node.js, Express, GraphQL, RESTful APIs, Python
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">
                    Database:
                  </span>
                  <span className="text-text-primary ml-2">
                    PostgreSQL, MongoDB
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Tools:</span>
                  <span className="text-text-primary ml-2">
                    Git, Docker, AWS, Jenkins, Jest, Webpack, ESlint, Lighthouse
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">
                    Structural:
                  </span>
                  <span className="text-text-primary ml-2">
                    Front End Architecture, Miro ERD Design, Technical Writing &
                    Documentation, Best Practices & Conventions
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-text-heading mb-3">
                Team & Creative Skills
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-text-heading">
                    Leadership:
                  </span>
                  <span className="text-text-primary ml-2">
                    Team Leadership, Mentoring Junior Developers,
                    Cross-functional Collaboration
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">
                    Project Management:
                  </span>
                  <span className="text-text-primary ml-2">
                    Agile Development, Automated JIRA & Asana, End-to-end
                    Delivery
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Design:</span>
                  <span className="text-text-primary ml-2">
                    UI/UX Design, Adobe Creative Suite, Figma, Creative
                    Direction
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Media:</span>
                  <span className="text-text-primary ml-2">
                    Audio Production, Video Editing, 3D Modeling
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">
                    Interactive:
                  </span>
                  <span className="text-text-primary ml-2">
                    WebGL, Three.js, Creative Coding, Installation Art
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">
            Education
          </h3>

          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-text-heading">
                BS in Computer Science: Game Design - Magna Cum Laude
              </h4>
              <p className="text-light-faded-turquoise font-medium">
                University of California, Santa Cruz
              </p>
              <p className="text-text-primary font-medium">
                Minor in Electronic Music — Core: Rachel Carson College
                Sustainability Studies
              </p>
            </div>
            <span className="text-text-primary">2015</span>
          </div>
        </section>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button
          url="/pdf/Weston%20Mossman%20Resume%20-%20Senior%20Full%20Stack%20Software%20Engineer%20%26%20Creative%20Consultant.pdf"
          download={true}
          color="primary"
          size="lg"
        >
          Download PDF
          <span
            aria-hidden="true"
            style={{ marginLeft: '0.5em', fontSize: '1.2em' }}
          >
            ↓
          </span>
        </Button>
      </div>
    </section>
  );
}
