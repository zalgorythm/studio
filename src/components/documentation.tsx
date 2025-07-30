import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText } from 'lucide-react';

const documents = [
    {
        title: "System Architecture Overview",
        content: "This document provides a high-level overview of the TrustWise system architecture, including the smart contract ecosystem, backend services, and frontend application. It outlines how these components interact to deliver a secure and reliable digital trust platform."
    },
    {
        title: "Smart Contract Technical Details",
        content: "A detailed technical breakdown of each smart contract's functionality, including function signatures, state variables, and event emissions. This document is intended for developers and auditors who need to understand the on-chain logic."
    },
    {
        title: "User Guide: Getting Started",
        content: "A step-by-step guide for new users on how to create a trust, add beneficiaries, allocate assets, and use the Clause Optimizer. It covers the end-to-end user journey from registration to trust deployment."
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
