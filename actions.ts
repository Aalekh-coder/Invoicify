"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET!));

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId && !orgId) {
    return;
  }

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email || !description) {
    return;
  }

  try {
    const [customer] = await db
      .insert(Customers)
      .values({ name, email, userId, organizationId: orgId })
      .returning({ id: Customers.id });

    const [invoice] = await db
      .insert(Invoices)
      .values({
        value,
        description,
        userId,
        customerId: customer.id,
        status: "open",
        organizationId: orgId,
      })
      .returning({ id: Invoices.id });
    redirect(`/invoices/${Invoices.id}`);
    console.log(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    // Handle the error as needed, e.g., return an error response or log it
  }
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));
  revalidatePath(`/invoices/${id}`, "page");
  console.log(results);
}

export async function deleteinvoiceAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;

  const results = await db
    .delete(Invoices)
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));
  redirect(`/dashboard`);
  console.log(results);
}

export async function createPayment(formData:FormData) {
  const headersList = headers();
  console.log(headersList)
  const origin = (await headersList).get("origin");
  const id = Number.parseInt(formData.get("id") as string);

  const [result] = await db.select({
    status:Invoices.value,
    value:Invoices.value,
  }).from(Invoices).where(eq(Invoices.id, id)).limit(1)
  
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_RANmiQR8lao0tC",
          unit_amount:result.value,
        },
        quantity:1,
     }
    ], mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled`,
  })
  if (!session.url) {
    throw new Error("Invaild Session")
  }
  redirect(session.url)
}