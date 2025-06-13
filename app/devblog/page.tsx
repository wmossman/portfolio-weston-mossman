import { BlogPosts } from 'app/components/posts';

export const metadata = {
  title: 'Devblog',
  description: 'Read my devblog.',
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter text-text-heading">Devblog</h1>
      <h3 className="text-xl my-12 text-text-primary">Total development time: 24 hours (3 workdays)</h3>
      <BlogPosts />
    </section>
  );
}
