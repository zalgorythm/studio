import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const beneficiaries = [
  { name: 'Alice Johnson', initials: 'AJ', role: 'Primary Beneficiary', avatar: 'https://placehold.co/40x40.png' },
  { name: 'Ben Carter', initials: 'BC', role: 'Contingent Beneficiary', avatar: 'https://placehold.co/40x40.png' },
  { name: 'Chloe Davis', initials: 'CD', role: 'Contingent Beneficiary', avatar: 'https://placehold.co/40x40.png' },
];

export function BeneficiaryList() {
  return (
    <div className="space-y-4">
      {beneficiaries.map((beneficiary) => (
        <div key={beneficiary.name} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={beneficiary.avatar} alt={beneficiary.name} data-ai-hint="person portrait" />
            <AvatarFallback>{beneficiary.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{beneficiary.name}</p>
            <p className="text-sm text-muted-foreground">{beneficiary.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
