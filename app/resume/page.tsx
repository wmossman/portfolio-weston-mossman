import Button from '../components/button-component';
import PageTitle from '../components/page-title';

export default function ResumePage() {
  return (
    <section>
      <PageTitle>Resume</PageTitle>

      {/* Resume Content */}
      <div className="max-w-5xl mx-auto bg-background-content rounded-lg p-8 mb-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-text-heading mb-2">Weston Mossman</h1>
          <h2 className="mb-2 text-xl text-light-faded-turquoise">
            Founder, Strategist, Executive Coach & Facilitator
          </h2>
          <h3 className="mb-4 text-l text-light-faded-turquoise">Regenerative Systems + Gamified Collaboration</h3>
          <div className="mb-4 flex flex-wrap justify-center items-center gap-4 text-sm text-text-primary">
            Santa Cruz, CA
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-primary">
            <a href="/#contact" className="text-faded-turquoise hover:text-light-faded-turquoise">
              Contact Form
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/westonmossman"
              className="text-faded-turquoise hover:text-light-faded-turquoise"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a href="https://github.com/wmossman" className="text-faded-turquoise hover:text-light-faded-turquoise">
              GitHub
            </a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">Summary</h3>
          <div className="text-text-primary space-y-3">
            <p>
              I build regenerative human experiences, strategies, and systems that serve all stakeholders, human and
              non-human. Staff engineer, musician, game designer, and sustainability advocate turned founder,
              strategist, executive coach, and facilitator.
            </p>
            <p>
              I help leaders and teams align, innovate with intention, and grow communities of practice that make change
              take root. I co-create projects from vision and strategy down to details and collateral, making the full
              scope legible and actionable.
            </p>
            <p>
              My work blends strategy, business development, governance, aesthetics, technology, game design,
              neuroscience, and regenerative system design to help people, organizations, and bioregions thrive.
            </p>
          </div>

          <div className="mt-5">
            <h4 className="text-lg font-bold text-text-heading mb-3">What I do</h4>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>Coach leaders, founders, and creatives, unlocking clarity, flow, and follow-through</li>
              <li>Advise mission-driven orgs on partnerships, funding pathways, and mission-aligned revenue</li>
              <li>Design and facilitate workshops, cohorts, action labs, and conferences for alignment and action</li>
              <li>Build playful, science-backed collaborations and simulations that mobilize cross-sector change</li>
              <li>Consult on strategy, programs, culture, governance, and process gamification for resilience</li>
            </ul>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">
            Experience
          </h3>

          {/* Convergence Courses */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Founder, Principal</h4>
                <p className="text-light-faded-turquoise font-medium">Convergence Courses</p>
              </div>
              <span className="text-text-primary">Feb 2025 - Present</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Design and deliver playful, science-backed workshops that turn complex challenges into shared clarity
                and coordinated action.
              </li>
              <li>
                Facilitate convergent sessions for teams, coalitions, and community networks, improving alignment,
                decision quality, and momentum.
              </li>
              <li>
                Build gamified experiences and collaboration toolkits that help groups navigate tradeoffs, roles,
                incentives, and accountability without burnout.
              </li>
              <li>
                Blend strategy, systems thinking, facilitation craft, and interaction design to make plans legible,
                executable, and relationally sustainable.
              </li>
            </ul>
          </div>

          {/* Strategy / Bizdev / Coaching */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Strategy, Bizdev, Creative Consultant & Coach</h4>
                <p className="text-light-faded-turquoise font-medium">Freelance</p>
              </div>
              <span className="text-text-primary">Nov 2022 - Present</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Advise leaders and teams on strategy, go-to-market, governance, and collaboration design to ship
                meaningful work.
              </li>
              <li>
                Run workshops and action labs for alignment, innovation, humane AI adoption, and change rollout across
                org functions.
              </li>
              <li>
                Design facilitation systems and artifacts: decision frameworks, program maps, partnership pathways, and
                story-driven plans.
              </li>
              <li>
                When useful, build technical prototypes and automation to support systems adoption and reduce
                operational friction.
              </li>
            </ul>
          </div>

          {/* Bloom.pm */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Head of Business Development & Programs</h4>
                <p className="text-light-faded-turquoise font-medium">Bloom.pm (Contract)</p>
              </div>
              <span className="text-text-primary">Aug 2025 - Dec 2025</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Engaged impact investors and catalytic funds to structure values-aligned financing with
                multi-dimensional ROI.
              </li>
              <li>
                Built strategic collaborations across climate and social impact partners to expand the ecosystem and
                pipeline.
              </li>
              <li>
                Designed and facilitated workshops, action labs, accelerators, and summits to elevate client growth and
                resilience.
              </li>
              <li>Managed contract execution and post-signing support to protect outcomes and deepen relationships.</li>
            </ul>
          </div>

          {/* Liminal Space */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Founder, Producer - Executive Director</h4>
                <p className="text-light-faded-turquoise font-medium">Liminal Space Collective</p>
              </div>
              <span className="text-text-primary">Dec 2021 - Jun 2025</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Launched and scaled a creative producer co-op delivering immersive art-tech experiences with 200+
                creators.
              </li>
              <li>
                Secured sales, grants, and partnerships to enable interactive productions and innovation incubators.
              </li>
              <li>
                Built the operating model for a sustainable multidisciplinary venue concept: immersive experiences,
                workshops, exhibitions, and leadership cultivation.
              </li>
              <li>
                Led cross-functional production teams (strategy, operations, design, build, programming, comms), shaping
                a culture of experimentation, learning, and communal creation.
              </li>
            </ul>
          </div>

          {/* SwellCycle */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Partnerships & Growth Lead</h4>
                <p className="text-light-faded-turquoise font-medium">SwellCycle Inc. (Contract)</p>
              </div>
              <span className="text-text-primary">Nov 2024 - Apr 2025</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Led sales and marketing strategy plus web design for a waste-negative manufacturing startup vertical.
              </li>
              <li>
                Mobilized network into 100+ leads, an exhibit sale, and museum partnerships supporting sustainability
                goals.
              </li>
              <li>
                Designed Autodesk PaaS integration for web prototyping, genAI toolchains, and automated complexity / eco
                analysis.
              </li>
            </ul>
          </div>

          {/* Hippo */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Staff Software Engineer, Engineering Guild Lead</h4>
                <p className="text-light-faded-turquoise font-medium">Hippo Insurance</p>
              </div>
              <span className="text-text-primary">2018 - 2022</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Led FE engineering guild, mentoring junior to senior engineers on technical plans, balance, and growth.
              </li>
              <li>
                Modernized Angular monolith into React/TypeScript/GraphQL micro-FE and BFF architecture, reducing TTI by
                90%.
              </li>
              <li>
                Built PM-controlled policy sales flow config and rendering system, improving product agility and
                reducing regressions.
              </li>
              <li>
                Owned UI architecture, components, conventions, hiring, and BDD practices through major scale and IPO.
              </li>
            </ul>
          </div>

          {/* eBay */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Full Stack Software Engineer</h4>
                <p className="text-light-faded-turquoise font-medium">eBay Inc.</p>
              </div>
              <span className="text-text-primary">2016 - 2018</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Worked on eBay Search UX and platform modernization, including Java to Node.js migration workstreams.
              </li>
              <li>
                Built accessible, responsive UI with test discipline and cross-browser support at high traffic scale.
              </li>
            </ul>
          </div>

          {/* Yahoo */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Front End Software Engineer</h4>
                <p className="text-light-faded-turquoise font-medium">Yahoo</p>
              </div>
              <span className="text-text-primary">2015 - 2016</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Developed reusable React components, instrumentation, and performance practices for finance products.
              </li>
              <li>Worked within Fluxible patterns, test workflows, and cross-device UI constraints.</li>
            </ul>
          </div>

          {/* SurveyMonkey / ASA */}
          <div className="mb-2">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Software Development Intern</h4>
                <p className="text-light-faded-turquoise font-medium">
                  SurveyMonkey + Administrative Software Applications
                </p>
              </div>
              <span className="text-text-primary">2013 - 2014</span>
            </div>
            <ul className="list-disc list-inside text-text-primary space-y-1 ml-4">
              <li>
                Built internal tools and search workflows, shipping production features with tests and maintainable UI.
              </li>
              <li>Worked across HTML/CSS/JS, Python web frameworks, and SQL-backed systems.</li>
            </ul>
          </div>
        </section>

        {/* Community + Civic */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">
            Civic, Community, Volunteering
          </h3>

          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Arts Commissioner</h4>
                <p className="text-light-faded-turquoise font-medium">City of Santa Cruz</p>
                <p className="text-text-primary">
                  Reviewing and supporting public art, promoting local arts and culture.
                </p>
              </div>
              <span className="text-text-primary">Feb 2025 - Present</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Strategy and Adaptation Mentor</h4>
                <p className="text-light-faded-turquoise font-medium">
                  California Doughnut Economics Coalition - Regenerate the Bay Accelerator
                </p>
                <p className="text-text-primary">
                  Mentored teams on strategy, adaptation, and doughnut economics outcomes across climate and community
                  work.
                </p>
              </div>
              <span className="text-text-primary">Aug 2025 - Dec 2025</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-text-heading">Strategy Volunteer</h4>
                <p className="text-light-faded-turquoise font-medium">Santa Cruz Rights of Nature Movement</p>
                <p className="text-text-primary">
                  Strategy support for enacting a Rights of Nature ordinance in Santa Cruz County.
                </p>
              </div>
              <span className="text-text-primary">Jun 2025 - Present</span>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">Skills</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-text-heading mb-3">Strategy, Facilitation, Change</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-text-heading">Core:</span>
                  <span className="text-text-primary ml-2">
                    Strategy, Strategic Planning, Program Design, Change Management, Systems Thinking, Governance
                    Support
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Facilitation:</span>
                  <span className="text-text-primary ml-2">
                    Workshops, Cohorts, Action Labs, Convenings, Conflict Navigation, Group Decision-Making
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Coaching:</span>
                  <span className="text-text-primary ml-2">
                    Executive Coaching, Leadership Development, Team Coaching, Habits and Follow-Through, Flow Practices
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Bizdev:</span>
                  <span className="text-text-primary ml-2">
                    Partnerships, Fundraising Support, Ecosystem Mapping, Sales Enablement, Proposal and Grant Writing
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Play:</span>
                  <span className="text-text-primary ml-2">
                    Gamification, Simulation Design, Role-Play Facilitation, Interaction Design, Collaborative
                    Storycraft
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-text-heading mb-3">Technical + Creative</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-text-heading">Product / Web:</span>
                  <span className="text-text-primary ml-2">
                    React, TypeScript, Next.js, Node.js, GraphQL, REST, HTML/CSS, Tailwind, Storybook, Jest
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Systems:</span>
                  <span className="text-text-primary ml-2">
                    Architecture, Documentation, BDD, Accessibility, Performance
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Creative:</span>
                  <span className="text-text-primary ml-2">
                    Experience Design, Figma, Adobe Suite, Creative Direction, Audio Production, 3D Modeling
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Interactive:</span>
                  <span className="text-text-primary ml-2">
                    Three.js, TouchDesigner, Installation Art, Rapid Prototyping, Live Visual Systems
                  </span>
                </div>
                <div>
                  <span className="font-medium text-text-heading">Leadership:</span>
                  <span className="text-text-primary ml-2">
                    Cross-functional Leadership, Mentorship, Hiring, Team Systems, Operational Clarity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-text-heading mb-6 pb-2 border-b border-accent-secondary">Education</h3>

          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold text-text-heading">
                BS in Computer Science: Game Design - Magna Cum Laude
              </h4>
              <p className="text-light-faded-turquoise font-medium">University of California, Santa Cruz</p>
              <p className="text-text-primary font-medium">
                Minor in Electronic Music - Core: Rachel Carson College Sustainability Studies
              </p>
            </div>
            <span className="text-text-primary">2015</span>
          </div>
        </section>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button url="/pdf/Weston%20Mossman%20Resume.pdf" download={true} color="primary" size="lg">
          Download PDF
          <span aria-hidden="true" style={{ marginLeft: '0.5em', fontSize: '1.2em' }}>
            ↓
          </span>
        </Button>
      </div>
    </section>
  );
}
