import { BlogPosts } from 'app/components/posts';
import PageTitle from 'app/components/page-title';

export const metadata = {
  title: 'Devblog',
  description: 'Read my devblog.',
};

export default function Page() {
  return (
    <section>
      <PageTitle>Devblog</PageTitle>
      <h3 className="text-xl my-12 text-text-heading">
        Follow along with my latest projects, experiments, and thoughts
      </h3>
      <BlogPosts />
    </section>
  );
}
