// cart should be in memory maybe redis

// {
//   "vendorId": "v123",
//   "items": [
//     {
//       "variantId": "var_1kg",
//       "qty": 2,
//       "price": 120
//     }
//   ]
// }
// model Cart {
//   id String @id @default(cuid())
//   userId String @unique
//   items CartItem[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// model CartItem{
//   id String @id @default(cuid())
//   cartId String
//   productId String
//   variantId String

//   name String
//   localName String
//   image String?
//   label String
//   price Int
//   quantity Int

//   cart Cart @relation(fields: [cartId],references: [id])

//   @@unique([cartId,productId,variantId])
// }
