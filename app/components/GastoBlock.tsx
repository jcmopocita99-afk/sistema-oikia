import { Input } from "./ui/Input";

type GastoFields = {
  factura: string;
  valor: string;
  concepto: string;
};

type Props = {
  title: string;
  values: GastoFields;
  onChange: (field: keyof GastoFields, value: string) => void;
};

export function GastoBlock({ title, values, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <p className="col-span-full text-sm font-semibold text-[var(--oikia-primary)]">{title}</p>
      <Input
        label="Factura"
        placeholder="Nº factura"
        value={values.factura}
        onChange={(e) => onChange("factura", e.target.value)}
      />
      <Input
        label="Valor"
        type="number"
        placeholder="0"
        value={values.valor}
        onChange={(e) => onChange("valor", e.target.value)}
      />
      <Input
        label="Concepto"
        placeholder="Descripción"
        value={values.concepto}
        onChange={(e) => onChange("concepto", e.target.value)}
      />
    </div>
  );
}
