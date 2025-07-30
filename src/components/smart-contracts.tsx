import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileJson, ShieldCheck, Landmark, Users, Clock } from 'lucide-react';

const contracts = [
    {
        icon: FileJson,
        title: "Smart Trust Factory",
        description: "A factory contract responsible for creating and deploying new, unique Smart Trust contracts for each user. This ensures a standardized and secure creation process."
    },
    {
        icon: Landmark,
        title: "Smart Trust Contract",
        description: "The core contract for an individual trust. It holds asset information, defines beneficiaries, and executes the distribution clauses based on triggers from the Oracle."
    },
    {
        icon: ShieldCheck,
        title: "Oracle Trigger Contract",
        description: "Acts as a decentralized oracle to securely monitor real-world events (e.g., death certificates, specific dates). When conditions are met, it triggers the Smart Trust Contract to execute distributions."
    },
    {
        icon: Users,
        title: "Beneficiary Registry",
        description: "Manages beneficiary identities and wallet addresses. This provides a secure and verifiable way to link beneficiaries to their respective trusts and ensures assets are sent to the correct individuals."
    },
    {
        icon: Clock,
        title: "Time-lock Contract",
        description: "A utility contract used to enforce time-based release conditions. For example, distributing assets to a beneficiary only after they reach a certain age."
    }
];


export function SmartContracts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Smart Contracts Architecture</CardTitle>
                <CardDescription>
                    The core of the TrustWise platform is powered by a series of interconnected smart contracts that ensure the secure and autonomous management and distribution of assets.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {contracts.map((contract, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <contract.icon className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">{contract.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {contract.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
