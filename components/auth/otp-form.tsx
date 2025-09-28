"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, RefreshCw } from "lucide-react"
import { simulateOTPVerify, simulateOTPSend, generateId } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { toast } from "sonner"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
})

type OTPFormData = z.infer<typeof otpSchema>

interface OTPFormProps {
  phoneData: { phone: string; countryCode: string }
  onBack: () => void
}

export function OTPForm({ phoneData, onBack }: OTPFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setUser } = useAuthStore()
  const router = useRouter()

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOTPChange = (value: string, index: number) => {
    const newOTP = form.getValues("otp").split("")
    newOTP[index] = value
    const otpString = newOTP.join("")

    form.setValue("otp", otpString)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (otpString.length === 6) {
      form.handleSubmit(handleSubmit)()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !form.getValues("otp")[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (data: OTPFormData) => {
    setIsLoading(true)

    try {
      const isValid = await simulateOTPVerify(data.otp)

      if (isValid) {
        const user = {
          id: generateId(),
          phone: phoneData.phone,
          countryCode: phoneData.countryCode,
          isAuthenticated: true,
          createdAt: new Date(),
        }

        setUser(user)
        toast.success("Successfully signed in!")
        router.push("/dashboard")
      } else {
        toast.error("Invalid OTP. Please try again.")
        form.reset()
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)

    try {
      const success = await simulateOTPSend(`${phoneData.countryCode}${phoneData.phone}`)

      if (success) {
        toast.success("OTP sent successfully!")
        setCountdown(30)
        setCanResend(false)
        form.reset()
        inputRefs.current[0]?.focus()
      } else {
        toast.error("Failed to resend OTP. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const otpValue = form.watch("otp")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={() => (
            <FormItem>
              <FormLabel>Enter 6-digit OTP</FormLabel>
              <FormControl>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpValue[index] || ""}
                      onChange={(e) => handleOTPChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-center space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
            {canResend ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleResendOTP} disabled={isResending}>
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            ) : (
              <p>Resend OTP in {countdown}s</p>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          For demo purposes, any 6-digit number will work as OTP
        </p>
      </form>
    </Form>
  )
}
