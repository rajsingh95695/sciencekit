import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { connectToDB } from "@/lib/db";
import FAQ from "@/models/FAQ";

export default async function FAQPage() {
  await connectToDB();
  const faqs = await FAQ.find({ active: true }).sort({ order: 1 }).lean();

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">FAQ</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Everything customers ask before they order</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq._id.toString()} value={faq._id.toString()}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
