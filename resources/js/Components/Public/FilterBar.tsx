type FilterBarProps = {
    items: string[];
    active: string;
    onChange: (item: string) => void;
};

export default function FilterBar({ items, active, onChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter">
            {items.map((item) => (
                <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={active === item}
                    onClick={() => onChange(item)}
                    className={
                        'rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 sm:px-5 sm:py-2.5 ' +
                        (active === item
                            ? 'border-navy-900 bg-navy-900 text-white shadow-md ring-2 ring-navy-100'
                            : 'border-line bg-white text-ink-muted shadow-sm hover:-translate-y-0.5 hover:border-navy-300 hover:text-navy-800 hover:shadow-md')
                    }
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
