import { z } from "zod";

// Zod schemas for validation
export const PostalAddressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  addressLocality: z.string().min(1, "City is required"),
  addressRegion: z.string().min(1, "State/Region is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  addressCountry: z.string().min(1, "Country is required"),
});

export const GeoCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const MedicalSpecialtySchema = z.object({
  name: z.string().min(1, "Specialty name is required"),
});

export const AvailableServiceSchema = z.object({
  type: z.enum(["MedicalTherapy", "MedicalProcedure"]),
  name: z.string().min(1, "Service name is required"),
});

export const ContactPointSchema = z.object({
  telephone: z.string().min(1, "Telephone is required"),
  contactType: z.string().min(1, "Contact type is required"),
  areaServed: z.string().optional(),
  availableLanguage: z.array(z.string()).min(1, "At least one language required"),
});

export const HospitalSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL"),
  telephone: z.string().min(1, "Telephone is required"),
  address: PostalAddressSchema,
  geo: GeoCoordinatesSchema,
  openingHours: z.string().min(1, "Opening hours are required"),
  medicalSpecialty: z.array(MedicalSpecialtySchema).min(1),
  availableService: z.array(AvailableServiceSchema).min(1),
  contactPoint: z.array(ContactPointSchema).min(1),
  sameAs: z.array(z.string().url()).optional(),
});

// TypeScript types
export type PostalAddress = z.infer<typeof PostalAddressSchema>;
export type GeoCoordinates = z.infer<typeof GeoCoordinatesSchema>;
export type MedicalSpecialty = z.infer<typeof MedicalSpecialtySchema>;
export type AvailableService = z.infer<typeof AvailableServiceSchema>;
export type ContactPoint = z.infer<typeof ContactPointSchema>;
export type Hospital = z.infer<typeof HospitalSchema>;

// JSON-LD conversion function
export function toJsonLd(hospital: Hospital) {
  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: hospital.name,
    description: hospital.description,
    url: hospital.url,
    telephone: hospital.telephone,
    address: {
      "@type": "PostalAddress",
      ...hospital.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...hospital.geo,
    },
    openingHours: hospital.openingHours,
    medicalSpecialty: hospital.medicalSpecialty.map((s) => ({
      "@type": "MedicalSpecialty",
      name: s.name,
    })),
    availableService: hospital.availableService.map((s) => ({
      "@type": s.type,
      name: s.name,
    })),
    contactPoint: hospital.contactPoint.map((c) => ({
      "@type": "ContactPoint",
      ...c,
    })),
    sameAs: hospital.sameAs,
  };
}
