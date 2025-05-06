import { projects } from './utils';
import ProjectsGrid from './components/ProjectsGrid';

export default function ProjectsPage() {
  // This is now a server component
  return <ProjectsGrid projects={projects} />;
}
