import { Metadata } from "next";
import { SIGN_CATEGORIES } from "@/data/signs";
import { CategoryGrid } from "@/components/CategoryGrid";

// One static SEO page per sign category
export function generateStaticParams() {
  return SIGN_CATEGORIES.map((c) => ({ cat: c.id }));
}

export function generateMetadata({ params }: { params: { cat: string } }): Metadata {
  const cat = SIGN_CATEGORIES.find((c) => c.id === params.cat);
  if (!cat) return {};
  return {
    title: `${cat.name} — K53 road signs South Africa`,
    description: `${cat.blurb} Learn all K53 ${cat.name.toLowerCase()} for the South African learner's licence test.`,
  };
}

export default function SignCategoryPage({ params }: { params: { cat: string } }) {
  return <CategoryGrid catId={params.cat} />;
}
