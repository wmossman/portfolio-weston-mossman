import ImageWithFallback from 'app/components/ImageWithFallback';

export default function ResumePage() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-semibold tracking-tighter text-text-heading">Resume</h1>
      <ImageWithFallback
        src="/images/Weston Mossman Resume.webp"
        alt="Resume"
        width={800}
        height={1100}
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '2rem' }}
      />
      <a
        href="/pdf/Weston%20Mossman%20Resume%20-%20Senior%20Full%20Stack%20Software%20Engineer%20%26%20Creative%20Consultant.pdf"
        download
        className="inline-flex items-center px-4 py-2 bg-accent-primary text-text-heading rounded hover:bg-accent-highlight transition-colors font-medium text-lg"
      >
        Download
        <span aria-hidden="true" style={{ marginLeft: '0.5em', fontSize: '1.2em' }}>↓</span>
      </a>
    </section>
  );
}