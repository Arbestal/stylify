import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">
        Personlig stylist
      </p>
      <h1 className="mt-2 font-display text-5xl uppercase tracking-tight text-ink">
        Stilify
      </h1>
      <div className="mt-8 w-full">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#c9491d",
              colorBackground: "#efeadf",
              colorForeground: "#1c1b19",
              borderRadius: "0px",
              fontFamily: "var(--font-plex-sans)",
            },
          }}
        />
      </div>
    </div>
  );
}
