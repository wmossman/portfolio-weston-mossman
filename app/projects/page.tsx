import { projects } from './utils';
import ProjectsGrid from './components/ProjectsGrid';

export default function ProjectsPage() {
  return (
    <section>
      <ProjectsGrid projects={projects} />
    </section>
  );
}
