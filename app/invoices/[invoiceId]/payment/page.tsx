// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import Container from "@/components/Container";
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/db";
// import { Customers, Invoices } from "@/db/schema";
// import { and, eq, isNull } from "drizzle-orm";
// import { notFound } from "next/navigation";

// const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
//   const invoiceId = parseInt(params?.invoiceId);
//   const { userId, orgId } = await auth();

//   if (isNaN(invoiceId)) {
//     throw new Error("invaild invoice ID");
//   }
//   let result;
//   if (orgId) {
//     [result] = await db
//       .select()
//       .from(Invoices)
//       .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//       .where(
//         and(
//           eq(Invoices.id, invoiceId),
//           eq(Invoices.organizationId, orgId ?? "default_user_id")
//         )
//       )
//       .limit(1);
//   } else {
//     [result] = await db
//       .select()
//       .from(Invoices)
//       .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
//       .where(
//         and(
//           eq(Invoices.id, invoiceId),
//           eq(Invoices.userId, userId ?? "default_user_id"),
//           isNull(Invoices.organizationId)
//         )
//       )
//       .limit(1);
//   }

//   if (!result) {
//     notFound();
//   }
//   const invoice = {
//     ...result.invoices,
//     customer: result.customers,
//   };

//   return (
//     <main className="w-full h-full">
//       <Container>
//         <div className="flex justify-between mb-8">
//           <h1 className="flex items-center gap-4 text-3xl font-semibold">
//             Invoices {invoice.id}
//             <Badge
//               className={cn(
//                 "rounded-full",
//                 invoice.status === "open" && "bg-blue-500",
//                 invoice.status === "paid" && "bg-green-500",
//                 invoice.status === "void" && "bg-zinc-500",
//                 invoice.status === "uncollectible" && "bg-red-500"
//               )}
//             >
//               {invoice?.status}
//             </Badge>
//           </h1>
       
//         </div>

//         <p className="text-3xl mb-3"> $ {(invoice?.value / 100).toFixed(2)}</p>
//         <p className="text-lg mb-8">{invoice?.description}</p>

//         <h2 className="font-bold text-lg mb-4">Billing Details</h2>

//         <ul className="grid gap-2">
//           <li className="flex gap-4">
//             <strong className="block w-28 flex-shrink-0 font-medium text-sm">
//               Invoice ID
//             </strong>
//             <span>{invoice?.id}</span>
//           </li>
//           <li className="flex gap-4">
//             <strong className="block w-28 flex-shrink-0 font-medium text-sm">
//               Invoice Date
//             </strong>
//             <span> {new Date(invoice?.createTs).toLocaleDateString()}</span>
//           </li>
//           <li className="flex gap-4">
//             <strong className="block w-28 flex-shrink-0 font-medium text-sm">
//               Invoice Name
//             </strong>
//             <span>{invoice.customer.name}</span>
//           </li>
//           <li className="flex gap-4">
//             <strong className="block w-28 flex-shrink-0 font-medium text-sm">
//               Billing Email
//             </strong>
//             <span>{invoice.customer.email}</span>
//           </li>
//         </ul>
//       </Container>
//     </main>
//   );
// };

// export default InvoicePage;




import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { createPayment } from "@/actions";

interface InvoicePageProps {
  params: { invoiceId: string };
}

const InvoicePage = async (props: InvoicePageProps) => {
  // Accessing params from props and parsing invoiceId as an integer
  const invoiceId = parseInt(props.params.invoiceId);

  // Error handling for invalid invoiceId
  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  // Fetch data from the database
  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  // Structuring invoice data
  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  return (
    <main className="w-full h-full">
      <Container>
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoice.id}
                <Badge
                  className={cn(
                    "rounded-full",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-500",
                    invoice.status === "void" && "bg-zinc-500",
                    invoice.status === "uncollectible" && "bg-red-500"
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-lg mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
            {invoice.status === "open" && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="flex gap-2 bg-green-700 font-bold">
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}

            {invoice.status === "paid" && (
              <p className="text-xl font-bold flex gap-2 items-center">
                <Check className="w-7 h-auto bg-green-500 rounded-full text-white p-1" />
                Invoice Paid
              </p>
            )}
          </div>
        </div>
        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
};

export default InvoicePage;
