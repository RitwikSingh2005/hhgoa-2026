"use client";

export type BuilderFormValues = { name: string; role: string; stack: string };

export default function BuilderForm({
  values,
  onChange,
}: {
  values: BuilderFormValues;
  onChange: (v: BuilderFormValues) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-md space-y-5 px-6">
      <Field
        label="Name"
        placeholder="Ritwik Singh"
        value={values.name}
        onChange={(v) => onChange({ ...values, name: v })}
        maxLength={40}
      />
      <Field
        label="Role / profession"
        placeholder="Backend Engineer"
        value={values.role}
        onChange={(v) => onChange({ ...values, role: v })}
        maxLength={40}
      />
      <Field
        label="Stack"
        placeholder="Java · Spring Boot · Systems"
        value={values.stack}
        onChange={(v) => onChange({ ...values, stack: v })}
        maxLength={50}
      />
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
}) {
  const id = `field-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-paper/30 bg-transparent py-2 font-body text-lg text-paper placeholder:text-paper/25 focus:border-sun focus:outline-none"
      />
    </div>
  );
}
