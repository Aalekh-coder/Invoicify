"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { SyntheticEvent, useState } from "react";
import { createAction } from "@/actions";
import SubmitButton from "@/components/SubmitButton";
import Form from "next/form";
import Container from "@/components/Container";

const Invoice = () => {
  const [state, setState] = useState("ready");

  const handleSubmit = async (e: SyntheticEvent) => {
    if (state === "pending") {
      e.preventDefault();
      return;
    }
    setState("pending");
  };

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Create Invoices</h1>
        </div>

        <Form
          action={createAction}
          onSubmit={handleSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label
              htmlFor="name"
              className="block font-semibold text-sm mb-2 text-left"
            >
              Billing Name
            </Label>
            <Input type="text" id="name" name="name" />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block font-semibold text-sm mb-2 text-left"
            >
              Billing Email
            </Label>
            <Input type="email" id="email" name="email" />
          </div>
          <div>
            <Label
              htmlFor="value"
              className="block font-semibold text-sm mb-2 text-left"
            >
              Billing value
            </Label>
            <Input type="number" id="value" name="value" />
          </div>
          <div>
            <Label className="block font-semibold text-sm mb-2 text-left">
              Description
            </Label>
            <textarea
              name="description"
              id="description"
              className="border-gray-500 w-full"
            ></textarea>
          </div>
          <div>
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
};

export default Invoice;
