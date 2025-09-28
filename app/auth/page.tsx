"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { PhoneForm } from "@/components/auth/phone-form"
import { OTPForm } from "@/components/auth/otp-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneData, setPhoneData] = useState<{ phone: string; countryCode: string } | null>(null)
  const { user } = useAuthStore()
  const router = useRouter()

  // Redirect if already authenticated
  if (user?.isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  const handlePhoneSubmit = (data: { phone: string; countryCode: string }) => {
    setPhoneData(data)
    setStep("otp")
  }

  const handleBackToPhone = () => {
    setStep("phone")
    setPhoneData(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 chat-gradient">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Gemini Chat</h1>
          <p className="text-white/80">Your intelligent conversation companion</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{step === "phone" ? "Sign In" : "Verify OTP"}</CardTitle>
            <CardDescription>
              {step === "phone"
                ? "Enter your phone number to get started"
                : `We sent a code to ${phoneData?.countryCode} ${phoneData?.phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "phone" ? (
              <PhoneForm onSubmit={handlePhoneSubmit} />
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleBackToPhone} className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to phone number
                </Button>
                <OTPForm phoneData={phoneData!} onBack={handleBackToPhone} />
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
