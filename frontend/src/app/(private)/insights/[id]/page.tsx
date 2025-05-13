"use client";

// Page component for detailed Insight view
import { Metadata } from "next";
import { useIaInsights } from "@/hooks";
import { InsightDetails } from "@/components/organismos/insights/InsightDetails";
import { useParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Detalhe do Insight",
  description: "Detalhes completos do insight financeiro",
};

export default function InsightDetailPage() {
  // Get insight ID from URL params
  const params = useParams();
  // Handle potential array type - take first element if it's an array
  const paramId = params.id;
  const insightId = Array.isArray(paramId) ? paramId[0] : paramId;

  return <div>{insightId && <InsightDetails insightId={insightId} />}</div>;
}
