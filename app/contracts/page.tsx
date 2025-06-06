export default function ExampleContracts () {
    return (
        <main className="space-y-10 p-8">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <p className="text-gray-700">
            This is a contracts page to manage and display contract information.
        </p>
        {/* Section 1 – Contract List */}
        <section>
            <h2 className="text-xl mb-2">Contract List</h2>
            {/* Placeholder for contract list component */}
            <div className="bg-white p-4 rounded shadow">
            <p>List of contracts will be displayed here.</p>
            </div>
        </section>
    
        {/* Section 2 – Contract Details */}
        <section>
            <h2 className="text-xl mb-2">Contract Details</h2>
            {/* Placeholder for contract details component */}
            <div className="bg-white p-4 rounded shadow">
            <p>Details of selected contract will be displayed here.</p>
            </div>
        </section>
        </main>
    );
}