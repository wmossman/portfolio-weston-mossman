import ExampleContracts from "app/components/playground/ExampleContracts";
import ExampleDashboard from "app/components/playground/ExampleDashboard";

export default function PlaygroundPage() {
  return (
    <main className="space-y-10 p-8">
      <h1 className="text-2xl font-bold">Playground</h1>
      <p className="text-gray-700">
        This is a playground page to experiment with different pre-production
        features.
      </p>
      {/* Section 1 – D3 spike */}
      <section>
        <h2 className="text-xl mb-2">D3 Line Chart Prototype</h2>
        <ExampleDashboard />
      </section>

      {/* Section 2 – RTK Query vs Zustand comparison */}
      <section>
        <h2 className="text-xl mb-2">Contracts CRUD Prototype</h2>
        <ExampleContracts />
      </section>
    </main>
  );
}
