import { FormData } from "@/lib/types";

export const LEFT_ACCORDION_HEIGHTS = {
  logo: "max-h-[700px]",
  background: "max-h-[260px]",
  canvas: "max-h-[520px]",
} as const;

export const RIGHT_ACCORDION_HEIGHTS = {
  info: "max-h-[420px]",
  letter: "max-h-[700px]",
} as const;

export const PERSONAL_INFO_FIELDS: Array<{
  name: keyof Pick<FormData, "name" | "email" | "phone" | "location">;
  label: string;
  placeholder: string;
}> = [
  { name: "name", label: "Full Name", placeholder: "Jane Doe" },
  { name: "email", label: "Email", placeholder: "jane@example.com" },
  { name: "phone", label: "Phone", placeholder: "(61) 9 0000-0000" },
  { name: "location", label: "Location", placeholder: "Brasília, Brazil" },
];

export const LETTER_BODY_PLACEHOLDER =
  "Dear recruiter, I'm grateful for [Company]...\\n\\nMy X years of experience will add value.\\n\\nI'd love the opportunity to connect.";
