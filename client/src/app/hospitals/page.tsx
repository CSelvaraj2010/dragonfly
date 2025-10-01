"use client";

import { useState } from "react";
import type {
  Hospital,
  PostalAddress,
  GeoCoordinates,
  MedicalSpecialty,
  AvailableService,
  ContactPoint,
} from "~/types/hospital";
import { HospitalSchema, toJsonLd } from "~/types/hospital";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showJsonLd, setShowJsonLd] = useState<number | null>(null);
  const [formData, setFormData] = useState<Hospital>(getEmptyHospital());
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getEmptyHospital(): Hospital {
    return {
      name: "",
      description: "",
      url: "",
      telephone: "",
      address: {
        streetAddress: "",
        addressLocality: "",
        addressRegion: "",
        postalCode: "",
        addressCountry: "US",
      },
      geo: {
        latitude: 0,
        longitude: 0,
      },
      openingHours: "",
      medicalSpecialty: [{ name: "" }],
      availableService: [{ type: "MedicalTherapy", name: "" }],
      contactPoint: [
        {
          telephone: "",
          contactType: "customer service",
          areaServed: "US",
          availableLanguage: ["English"],
        },
      ],
      sameAs: [],
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = HospitalSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path.join(".")] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    if (editingIndex !== null) {
      const updated = [...hospitals];
      updated[editingIndex] = formData;
      setHospitals(updated);
      setEditingIndex(null);
    } else {
      setHospitals([...hospitals, formData]);
    }

    setFormData(getEmptyHospital());
  };

  const handleEdit = (index: number) => {
    setFormData(hospitals[index]!);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setHospitals(hospitals.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFormData(getEmptyHospital());
    setEditingIndex(null);
    setErrors({});
  };

  const addSpecialty = () => {
    setFormData({
      ...formData,
      medicalSpecialty: [...formData.medicalSpecialty, { name: "" }],
    });
  };

  const removeSpecialty = (index: number) => {
    setFormData({
      ...formData,
      medicalSpecialty: formData.medicalSpecialty.filter((_, i) => i !== index),
    });
  };

  const addService = () => {
    setFormData({
      ...formData,
      availableService: [
        ...formData.availableService,
        { type: "MedicalTherapy", name: "" },
      ],
    });
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      availableService: formData.availableService.filter((_, i) => i !== index),
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      sameAs: [...(formData.sameAs || []), ""],
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      sameAs: formData.sameAs?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-4xl font-bold">Hospital Organization Manager</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">
            {editingIndex !== null ? "Edit Hospital" : "Add Hospital"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium">Hospital Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 w-full rounded border p-2"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Website URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 w-full rounded border p-2"
                />
                {errors.url && <p className="text-sm text-red-600">{errors.url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Telephone *</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="mt-1 w-full rounded border p-2"
                />
                {errors.telephone && (
                  <p className="text-sm text-red-600">{errors.telephone}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="border-t pt-4">
              <h3 className="mb-2 text-lg font-semibold">Address</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Street Address *"
                  value={formData.address.streetAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, streetAddress: e.target.value },
                    })
                  }
                  className="w-full rounded border p-2"
                />
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.address.addressLocality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          addressLocality: e.target.value,
                        },
                      })
                    }
                    className="rounded border p-2"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={formData.address.addressRegion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          addressRegion: e.target.value,
                        },
                      })
                    }
                    className="rounded border p-2"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code *"
                    value={formData.address.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, postalCode: e.target.value },
                      })
                    }
                    className="rounded border p-2"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country *"
                  value={formData.address.addressCountry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        addressCountry: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded border p-2"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="border-t pt-4">
              <h3 className="mb-2 text-lg font-semibold">Location Coordinates</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude *"
                    value={formData.geo.latitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        geo: { ...formData.geo, latitude: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full rounded border p-2"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude *"
                    value={formData.geo.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        geo: { ...formData.geo, longitude: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full rounded border p-2"
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium">Opening Hours *</label>
              <input
                type="text"
                placeholder="e.g., Mo-Fr 08:00-17:00, Sa-Su 09:00-13:00"
                value={formData.openingHours}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
                }
                className="mt-1 w-full rounded border p-2"
              />
              {errors.openingHours && (
                <p className="text-sm text-red-600">{errors.openingHours}</p>
              )}
            </div>

            {/* Medical Specialties */}
            <div className="border-t pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Medical Specialties</h3>
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {formData.medicalSpecialty.map((specialty, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Specialty name"
                    value={specialty.name}
                    onChange={(e) => {
                      const updated = [...formData.medicalSpecialty];
                      updated[index] = { name: e.target.value };
                      setFormData({ ...formData, medicalSpecialty: updated });
                    }}
                    className="flex-1 rounded border p-2"
                  />
                  {formData.medicalSpecialty.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Available Services */}
            <div className="border-t pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Services</h3>
                <button
                  type="button"
                  onClick={addService}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {formData.availableService.map((service, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <select
                    value={service.type}
                    onChange={(e) => {
                      const updated = [...formData.availableService];
                      updated[index] = {
                        ...updated[index]!,
                        type: e.target.value as "MedicalTherapy" | "MedicalProcedure",
                      };
                      setFormData({ ...formData, availableService: updated });
                    }}
                    className="rounded border p-2"
                  >
                    <option value="MedicalTherapy">Medical Therapy</option>
                    <option value="MedicalProcedure">Medical Procedure</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Service name"
                    value={service.name}
                    onChange={(e) => {
                      const updated = [...formData.availableService];
                      updated[index] = { ...updated[index]!, name: e.target.value };
                      setFormData({ ...formData, availableService: updated });
                    }}
                    className="flex-1 rounded border p-2"
                  />
                  {formData.availableService.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="border-t pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  + Add
                </button>
              </div>
              {formData.sameAs?.map((link, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => {
                      const updated = [...(formData.sameAs || [])];
                      updated[index] = e.target.value;
                      setFormData({ ...formData, sameAs: updated });
                    }}
                    className="flex-1 rounded border p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 border-t pt-4">
              <button
                type="submit"
                className="flex-1 rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
              >
                {editingIndex !== null ? "Update Hospital" : "Add Hospital"}
              </button>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">Saved Hospitals</h2>

          {hospitals.length === 0 ? (
            <p className="text-gray-500">No hospitals added yet.</p>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital, index) => (
                <div key={index} className="rounded border p-4">
                  <h3 className="text-xl font-bold">{hospital.name}</h3>
                  <p className="text-sm text-gray-600">{hospital.description}</p>
                  <p className="mt-2 text-sm">
                    <strong>Address:</strong> {hospital.address.streetAddress},{" "}
                    {hospital.address.addressLocality}, {hospital.address.addressRegion}{" "}
                    {hospital.address.postalCode}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {hospital.telephone}
                  </p>
                  <p className="text-sm">
                    <strong>Website:</strong>{" "}
                    <a
                      href={hospital.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {hospital.url}
                    </a>
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setShowJsonLd(showJsonLd === index ? null : index)
                      }
                      className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                    >
                      {showJsonLd === index ? "Hide" : "Show"} JSON-LD
                    </button>
                  </div>

                  {showJsonLd === index && (
                    <div className="mt-3">
                      <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                        {JSON.stringify(toJsonLd(hospital), null, 2)}
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(toJsonLd(hospital), null, 2),
                          );
                          alert("JSON-LD copied to clipboard!");
                        }}
                        className="mt-2 rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-800"
                      >
                        Copy JSON-LD
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
