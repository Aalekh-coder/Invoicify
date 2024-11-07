import { notFound } from "next/navigation";
import Invoice from "../[invoiceId]/Invoice";
import { Customers, Invoices } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

const InvoicePage = async ({ params }: { params: { invoiceId: string } }) => {
  const invoiceId = parseInt(params?.invoiceId);
  const { userId,orgId } = await auth();

  if (isNaN(invoiceId)) {
    throw new Error("invaild invoice ID");
  }
  let result;
  if (orgId) {
     [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
      and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.organizationId, orgId ?? "default_user_id")
      )
  ).limit(1);
  } else {
     [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
      and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.userId, userId ?? "default_user_id"),
        isNull(Invoices.organizationId)
      )
  ).limit(1);
  }

 if (!result) {
    notFound();
  }
  const invoice = {
    ...result.invoices,
    customer: result.customers
  }
  return <Invoice invoice={invoice} />;
};

export default InvoicePage;
