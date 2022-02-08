export const InvoiceFormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="py-6">
        <h2 className="mb-6 font-caption text-2xl font-medium">{title}</h2>
        <div className="space-y-6">{children}</div>
    </section>
)
