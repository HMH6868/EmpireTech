"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Facebook, Github, UserPlus, Eye, EyeOff } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="#4285F4"
      d="M22.5 12.273c0-.854-.077-1.67-.221-2.455H12v4.64h5.92c-.256 1.38-1.035 2.548-2.2 3.333v2.774h3.555c2.08-1.915 3.225-4.735 3.225-8.292Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.917 0 5.364-.965 7.152-2.435l-3.555-2.774c-.99.665-2.255 1.06-3.597 1.06-2.768 0-5.111-1.868-5.947-4.384H2.37v2.852C4.149 20.897 7.79 23 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M6.053 14.467A7.027 7.027 0 0 1 5.684 12c0-.862.149-1.7.37-2.467V6.68H2.37A11.003 11.003 0 0 0 1 12a11 11 0 0 0 1.37 5.32l3.684-2.853Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.958c1.59 0 3.018.547 4.143 1.619l3.102-3.102C17.364 1.64 14.917.5 12 .5 7.79.5 4.149 2.603 2.37 6.68l3.684 2.853C4.889 7.017 7.232 4.958 12 4.958Z"
    />
  </svg>
)

const copy = {
  heading: { en: "Create Account", vi: "Tạo tài khoản" },
  subheading: { en: "Join Empire Tech and start shopping", vi: "Gia nhập Empire Tech và bắt đầu mua sắm" },
  nameLabel: { en: "Full Name", vi: "Họ và tên" },
  namePlaceholder: { en: "John Doe", vi: "Nguyễn Văn A" },
  emailLabel: { en: "Email", vi: "Email" },
  emailPlaceholder: { en: "you@example.com", vi: "ban@example.com" },
  passwordLabel: { en: "Password", vi: "Mật khẩu" },
  confirmPasswordLabel: { en: "Confirm Password", vi: "Xác nhận mật khẩu" },
  passwordPlaceholder: { en: "••••••••", vi: "••••••••" },
  submitIdle: { en: "Create Account", vi: "Tạo tài khoản" },
  submitLoading: { en: "Creating account...", vi: "Đang tạo tài khoản..." },
  haveAccountPrefix: { en: "Already have an account?", vi: "Đã có tài khoản?" },
  signinCta: { en: "Sign in", vi: "Đăng nhập" },
  errorTitle: { en: "Error", vi: "Lỗi" },
  errorDescription: { en: "Passwords do not match", vi: "Mật khẩu không trùng khớp" },
  successTitle: { en: "Account created", vi: "Tạo tài khoản thành công" },
  successDescription: { en: "Welcome to Empire Tech!", vi: "Chào mừng bạn đến với Empire Tech!" },
  socialTitle: { en: "Or continue with", vi: "Hoặc tiếp tục bằng" },
  facebookCta: { en: "Continue with Facebook", vi: "Đăng ký với Facebook" },
  googleCta: { en: "Continue with Google", vi: "Đăng ký với Google" },
  githubCta: { en: "Continue with GitHub", vi: "Đăng ký với GitHub" },
  showPassword: { en: "Show password", vi: "Hiện mật khẩu" },
  hidePassword: { en: "Hide password", vi: "Ẩn mật khẩu" },
} as const

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: copy.errorTitle[language],
        description: copy.errorDescription[language],
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Mock registration
    setTimeout(() => {
      toast({
        title: copy.successTitle[language],
        description: copy.successDescription[language],
      })
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <UserPlus className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="mt-4 text-2xl">{copy.heading[language]}</CardTitle>
                <CardDescription>{copy.subheading[language]}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{copy.nameLabel[language]}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={copy.namePlaceholder[language]}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{copy.emailLabel[language]}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={copy.emailPlaceholder[language]}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{copy.passwordLabel[language]}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={copy.passwordPlaceholder[language]}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? copy.hidePassword[language] : copy.showPassword[language]}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{copy.confirmPasswordLabel[language]}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={copy.passwordPlaceholder[language]}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? copy.hidePassword[language] : copy.showPassword[language]}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? copy.submitLoading[language] : copy.submitIdle[language]}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {copy.socialTitle[language]}
                  </p>
                  <div className="flex items-center gap-3">
                    {[
                      {
                        id: "facebook",
                        label: copy.facebookCta[language],
                        icon: Facebook,
                        accent: "text-[#1877F2]",
                      },
                      { id: "google", label: copy.googleCta[language], icon: GoogleIcon, accent: "" },
                      { id: "github", label: copy.githubCta[language], icon: Github, accent: "" },
                    ].map(({ id, label, icon: Icon, accent }) => (
                      <Button
                        key={id}
                        type="button"
                        variant="outline"
                        className="flex-1 aspect-square justify-center p-0"
                        aria-label={label}
                      >
                        <Icon className={`h-5 w-5 ${accent}`} />
                        <span className="sr-only">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">{copy.haveAccountPrefix[language]} </span>
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    {copy.signinCta[language]}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
