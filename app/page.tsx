import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold">Healthcare security</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline">
              MVP Prototype
            </Badge>
            <Link href="/login">
              <Button>Login to Demo EHR</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="max-w-xl">
            <h1 className="text-pretty text-3xl sm:text-4xl font-semibold">
              Medical‑grade security for healthcare—{" "}
              <span className="text-primary">continuous protection, zero friction.</span>
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Combine biometric sign‑in with passive behavioral monitoring (typing and mouse signals) to keep sessions
              secure without interrupting clinical workflows.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                <Button className="w-full sm:w-auto" size="lg">
                  Start Demo
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-primary" aria-hidden />
                Continuous authentication
              </span>
              <span>•</span>
              <span>HIPAA-ready architecture (MVP)</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-card">
            <Image
              src={"/placeholder.svg?height=600&width=800&query=healthcare%20team%20using%20secure%20EHR%20software"}
              alt="Clinicians using a secure EHR system with continuous authentication"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="mx-auto max-w-5xl px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Biometric Login</CardTitle>
              <CardDescription>Face or fingerprint for initial verification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Authenticate once, then let the system keep your session trusted in the background.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Continuous Monitoring</CardTitle>
              <CardDescription>Typing and mouse behavioral signals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detect deviations from your baseline to flag possible session takeovers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Anomaly Detection</CardTitle>
              <CardDescription>Adaptive trust with instant alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                When anomalies are detected, request quick re‑authentication without losing context.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>EHR Demo Context</CardTitle>
              <CardDescription>Safe prototype for clinical workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore on a mock EHR dashboard—no PHI or live integrations required for the MVP.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance Badges */}
      <section aria-labelledby="compliance" className="mx-auto max-w-5xl px-4 py-10">
        <h2 id="compliance" className="text-xl font-semibold text-pretty">
          Compliance and Trust
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Built to align with healthcare security standards and clinical expectations.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center justify-center rounded-md border bg-card px-3 py-6 text-center">
            <span className="text-sm font-medium">HIPAA</span>
          </div>
          <div className="flex items-center justify-center rounded-md border bg-card px-3 py-6 text-center">
            <span className="text-sm font-medium">HITECH</span>
          </div>
          <div className="flex items-center justify-center rounded-md border bg-card px-3 py-6 text-center">
            <span className="text-sm font-medium">SOC 2</span>
          </div>
          <div className="flex items-center justify-center rounded-md border bg-card px-3 py-6 text-center">
            <span className="text-sm font-medium">ISO 27001</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="testimonials" className="mx-auto max-w-5xl px-4 py-10">
        <h2 id="testimonials" className="text-xl font-semibold text-pretty">
          Trusted by clinicians and IT leaders
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">“Security without slowing us down.”</CardTitle>
              <CardDescription>ED Nurse Manager</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We kept our focus on patients while the system quietly protected access in the background.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">“Easy to pilot, easy to trust.”</CardTitle>
              <CardDescription>Healthcare IT Director</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The MVP fit right into our demo EHR and showed clear promise for continuous authentication.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Footer */}
      <section aria-labelledby="cta" className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border bg-card p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="cta" className="text-lg font-semibold text-pretty">
                Join the future of healthcare security
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start the demo and experience continuous authentication in minutes.
              </p>
            </div>
            <Link href="/login">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
