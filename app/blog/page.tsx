import { BlogPosts } from 'app/components/posts';

export const metadata = {
  title: 'Degblog',
  description: 'Read my blog.',
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Devblog</h1>
      <h3 className="text-xl my-12">Total development time: 2 + 4 + 5 + 1 + 5 + 1 + 6 = 24 hours (3 workdays)</h3>
      <BlogPosts />
    </section>
  );
}
