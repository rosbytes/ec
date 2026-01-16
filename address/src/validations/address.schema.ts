import { z } from "zod";

const CoordinatesSchema = z
  .array(z.number())
  .length(2, "Coordinates must be [longitude, latitude]")
  .refine(
    ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    "Invalid longitude/latitude values"
  );

export const CreateAddressSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    phone: z
      .string()
      .regex(/^(\+91)?[6-9]\d{9}$/, "Invalid Indian phone number"),

    apartmentName: z.string().max(200).optional(),
    streetDetails: z.string().max(300).optional(),
    landmark: z.string().max(200).optional(),

    addressType: z.enum(["Home", "Office", "Other"]),

    location: z.object({
      type: z.literal("Point"),
      coordinates: CoordinatesSchema,
      address: z.string().min(1),
    }),

    isDefault: z.boolean().optional(),
  }),
});

export const UpdateAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address id"),
  }),

  body: z
    .object({
      name: z.string().max(100).optional(),
      phone: z
        .string()
        .regex(/^(\+91)?[6-9]\d{9}$/)
        .optional(),

      apartmentName: z.string().max(200).optional(),
      streetDetails: z.string().max(300).optional(),
      landmark: z.string().max(200).optional(),

      addressType: z.enum(["Home", "Office", "Other"]).optional(),

      location: z
        .object({
          type: z.literal("Point"),
          coordinates: CoordinatesSchema.optional(),
          address: z.string().optional(),
        })
        .optional(),

      isDefault: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be updated"
    ),
});



export const GetAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});


export const SetDefaultAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});


export const DeleteAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid address ID"),
  }),
});


export const CheckServiceabilitySchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});
