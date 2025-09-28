"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Phone } from "lucide-react"
import { simulateOTPSend } from "@/lib/utils"
import { toast } from "sonner"
import type { Country } from "@/lib/types"

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
})

type PhoneFormData = z.infer<typeof phoneSchema>

interface PhoneFormProps {
  onSubmit: (data: { phone: string; countryCode: string }) => void
}

export function PhoneForm({ onSubmit }: PhoneFormProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)

  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "",
      phone: "",
    },
  })

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag")
      const data: Country[] = await response.json()

      // Filter countries with valid phone codes and sort by name
      const validCountries = data
        .filter((country) => country.idd?.root && country.idd?.suffixes?.length > 0)
        .sort((a, b) => a.name.common.localeCompare(b.name.common))

      setCountries(validCountries)
    } catch (error) {
      console.error("Failed to fetch countries:", error)
      toast.error("Failed to load countries. Please refresh the page.")
    } finally {
      setIsLoadingCountries(false)
    }
  }

  const handleSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)

    try {
      const success = await simulateOTPSend(`${data.countryCode}${data.phone}`)

      if (success) {
        toast.success("OTP sent successfully!")
        onSubmit(data)
      } else {
        toast.error("Failed to send OTP. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getCountryDialCode = (country: Country): string => {
    const root = country.idd.root
    const suffix = country.idd.suffixes[0]
    return `${root}${suffix}`
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCountries}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select country"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {countries.map((country) => {
                    const dialCode = getCountryDialCode(country)
                    return (
                      <SelectItem key={country.cca2} value={dialCode}>
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <span>{country.name.common}</span>
                          <span className="text-muted-foreground">({dialCode})</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input {...field} placeholder="Enter your phone number" className="pl-10" disabled={isLoading} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading || isLoadingCountries}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>
    </Form>
  )
}
