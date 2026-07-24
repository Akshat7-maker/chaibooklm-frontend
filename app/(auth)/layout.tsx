import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative bg-background">
      {/* Left section - Brand */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-muted/30 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-0"></div>
        <div className="relative z-10">
          <Logo size="lg" showText />
        </div>
        <div className="relative z-10 max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Your AI-powered knowledge workspace
          </h1>
          <p className="text-muted-foreground">
            Upload your documents, videos, and links to get instant insights, summaries, and answers backed by your sources.
          </p>
        </div>
      </div>
      
      {/* Right section - Content */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-tl from-background via-background to-primary/5 z-0 md:hidden"></div>
        <div className="absolute top-6 left-6 z-10 md:hidden">
          <Logo size="default" showText />
        </div>
        <div className="w-full max-w-md z-10">
          {children}
        </div>
      </div>
    </div>
  );
}