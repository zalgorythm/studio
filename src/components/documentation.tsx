import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText } from 'lucide-react';

const documents = [
    {
        title: "System Architecture Overview",
        content: "This document provides a comprehensive, high-level overview of the TrustWise system architecture. It details the interaction between the Next.js frontend, the Genkit-powered AI services for features like the Clause Optimizer, and the underlying smart contract ecosystem on the blockchain. Key diagrams illustrate data flow for trust creation, beneficiary management, and automated asset distribution triggers. It is essential reading for any developer or stakeholder wanting to understand the platform's core components and how they interconnect to deliver a secure and reliable digital trust platform."
    },
    {
        title: "Smart Contract Technical Details",
        content: "A detailed technical breakdown of each smart contract's functionality, intended for developers and auditors. This document includes function signatures, state variables, modifiers, and event emissions for the Smart Trust Factory, individual Smart Trust Contracts, the Oracle Trigger, and the Beneficiary Registry. It also contains code snippets, security considerations, and deployment scripts to ensure a transparent and auditable on-chain logic."
    },
    {
        title: "User Guide: Getting Started",
        content: "A step-by-step guide for new users on how to create and manage their digital trust. This guide covers the end-to-end user journey, from initial account setup to deploying a legally-binding Smart Trust. It includes tutorials on how to add beneficiaries using their decentralized identifiers (DIDs), allocate various types of assets, and leverage the AI Clause Optimizer to customize the trust to specific needs. Screenshots and examples are provided throughout to ensure a smooth onboarding experience."
    },
];


export function Documentation() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Documentation</CardTitle>
                <CardDescription>
                    Explore the project documents to understand the architecture, smart contracts, and user guides.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {documents.map((doc, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">{doc.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {doc.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
