import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, MessageSquare, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="default" showText />
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <div className="w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-slide-up">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              ChaibookLM is now in beta
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Your AI Knowledge <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                Workspace
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
              Upload PDFs, YouTube videos, and websites. Chat with an AI that understands your sources and provides instant, grounded answers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base group")}>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-8 text-base")}>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/20 border-t border-border/40">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to learn faster</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools to synthesize information from multiple sources.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="glass p-8 rounded-2xl border border-white/5 hover-lift animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Source Knowledge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload PDFs, YouTube videos, websites, and more. All your knowledge in one place, automatically organized.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="glass p-8 rounded-2xl border border-white/5 hover-lift animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ask questions and get instant answers grounded in your uploaded sources, with inline citations.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="glass p-8 rounded-2xl border border-white/5 hover-lift animate-slide-up" style={{ animationDelay: "300ms" }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch your documents get processed in real-time with live status updates using WebSockets.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Logo size="sm" showText={false} />
            <span className="text-sm font-medium">ChaibookLM</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChaibookLM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
