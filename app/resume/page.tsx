import ImageWithFallback from 'app/components/ImageWithFallback';
import Button from 'app/components/Button';
import PageTitle from 'app/components/PageTitle';

export default function ResumePage() {
  return (
    <section>
      <PageTitle>Resume</PageTitle>
      <ImageWithFallback
        src="/images/Weston Mossman Resume.webp"
        alt="Resume"
        width={800}
        height={1100}
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '2rem' }}
      />
      <Button
        url="/pdf/Weston%20Mossman%20Resume%20-%20Senior%20Full%20Stack%20Software%20Engineer%20%26%20Creative%20Consultant.pdf"
        download={true}
        color="primary"
        size="lg"
      >
        Download
        <span aria-hidden="true" style={{ marginLeft: '0.5em', fontSize: '1.2em' }}>↓</span>
      </Button>
    </section>
  );
}