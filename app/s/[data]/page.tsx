import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeShareData } from "@/lib/shareEncode";

const SITE_URL = "https://hhgoa2026-identity.vercel.app";

function ogImageUrl(data: NonNullable<ReturnType<typeof decodeShareData>>) {
  const params = new URLSearchParams({
    name: data.name,
    title: data.title,
    role: data.role,
    id: data.builderNumber,
  });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

export async function generateMetadata({ params }: { params: { data: string } }): Promise<Metadata> {
  const data = decodeShareData(params.data);
  if (!data) {
    return { title: "HH Goa 2026 Builder Identity" };
  }
  const title = `${data.name} — ${data.title} @ HH Goa 2026`;
  const description = data.role
    ? `${data.name} is building HH Goa 2026 as a ${data.title} — ${data.role}.`
    : `${data.name} generated their HH Goa 2026 builder identity.`;
  const image = ogImageUrl(data);

  return {
    title,
    description,
    openGraph: { title, description, images: [image], url: `${SITE_URL}/s/${params.data}` },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function SharePage({ params }: { params: { data: string } }) {
  const data = decodeShareData(params.data);
  if (!data) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-6 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-sun">HH Goa 2026 &middot; Builder Identity</p>
      <img
        src={ogImageUrl(data)}
        alt={`${data.name}'s HH Goa 2026 builder identity card, titled ${data.title}`}
        className="reg-border w-full max-w-xl"
      />
      <div>
        <h1 className="font-display text-3xl text-paper">{data.name}</h1>
        <p className="mt-2 font-mono text-sm uppercase tracking-[0.14em] text-laterite-light">
          {data.title}
          {data.role ? ` — ${data.role}` : ""}
        </p>
      </div>
      <Link
        href="/"
        className="bg-laterite px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sun hover:text-ink"
      >
        Make your own
      </Link>
    </main>
  );
}
