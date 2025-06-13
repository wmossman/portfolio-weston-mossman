import { BlogPosts } from 'app/components/posts';
import PageTitle from 'app/components/PageTitle';

export const metadata = {
  title: 'Devblog',
  description: 'Read my devblog.',
};

export default function Page() {
  return (
    <section>
      <PageTitle>Devblog</PageTitle>
      <h3 className="text-xl my-12 text-text-heading">Total development time: 24 hours (3 workdays)</h3>
      <BlogPosts />
    </section>
  );
}
