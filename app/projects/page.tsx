import { projects } from './utils';
import ProjectsGrid from './components/projects-grid';

export default function ProjectsPage() {
  return (
    <section>
      <ProjectsGrid projects={projects} />
    </section>
  );
}
