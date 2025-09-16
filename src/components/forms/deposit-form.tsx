"use client"

import { useTransition, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  amount: z
    .number({ error: "Enter a valid number" })
    .min(100, "Minimum deposit is ₦100")
    .max(1_000_000, "Maximum deposit is ₦1,000,000"),
})

type Values = z.infer<typeof schema>

export function DepositForm({ onSuccess, paymentMethod }: { onSuccess: () => void; paymentMethod: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  })

  const onSubmit = (values: Values) => {
    setError(null)
    startTransition(async () => {
      try {
        const endpoint = paymentMethod === "paystack" ? "/api/paystack/initialize" : "/api/flutterwave/initialize";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message ?? "Deposit init failed")
          return
        }
        onSuccess()
        // Redirect to payment page
        window.location.href = data.paymentUrl
      } catch {
        setError("Unexpected error, please try again")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₦)</FormLabel>
              <Input
                type="number"
                placeholder="1000"
                min="100"
                step="1"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow empty input and valid numeric values
                  if (value === '' || /^[0-9]*$/.test(value)) {
                    field.onChange(value ? Number(value) : 0); // Convert to number or set to 0
                  }
                }}
                // Add this to prevent showing leading zeros
                onFocus={(e) => e.target.select()} // Select the input text on focus
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Processing…" : "Proceed"}
        </Button>
      </form>
    </Form>
  )
}