/**
 * Prisma variant of the idempotent entity-resolution upsert.
 *
 * Reference implementation — not exercised by the smoke test, since it needs a
 * generated `@prisma/client`. It mirrors the semantics of tools/etl/upsert.sql.
 *
 * Prisma cannot express "increment only when a new source row was inserted" or
 * a jsonb `||` merge in a single `upsert`, so we use an interactive transaction:
 *   1) detect whether this (entity, source, record) assertion is new,
 *   2) upsert the source row,
 *   3) upsert the entity, incrementing trust_score only for a new source and
 *      merging canonical fields application-side.
 *
 * Schema (schema.prisma):
 *
 *   model Entity {
 *     entityHash  String        @id @map("entity_hash")
 *     canonical   Json          @default("{}")
 *     trustScore  Int           @default(0) @map("trust_score")
 *     sourceCount Int           @default(0) @map("source_count")
 *     firstSeen   DateTime      @default(now()) @map("first_seen")
 *     lastSeen    DateTime      @updatedAt      @map("last_seen")
 *     sources     EntitySource[]
 *     @@map("entity")
 *   }
 *
 *   model EntitySource {
 *     entityHash   String   @map("entity_hash")
 *     sourceSystem String   @map("source_system")
 *     sourceId     String   @map("source_id")
 *     payload      Json     @default("{}")
 *     firstSeen    DateTime @default(now()) @map("first_seen")
 *     lastSeen     DateTime @updatedAt      @map("last_seen")
 *     entity       Entity   @relation(fields: [entityHash], references: [entityHash], onDelete: Cascade)
 *     @@id([entityHash, sourceSystem, sourceId])
 *     @@map("entity_source")
 *   }
 */

import { PrismaClient, Prisma } from '@prisma/client';

export interface NormalizedEntity {
  entityHash: string;
  sourceSystem: string;
  sourceId: string;
  payload: Prisma.InputJsonValue;
  canonical: Record<string, Prisma.InputJsonValue>;
}

export interface UpsertResult {
  entityHash: string;
  trustScore: number;
  sourceCount: number;
}

export async function upsertEntity(
  prisma: PrismaClient,
  input: NormalizedEntity,
): Promise<UpsertResult> {
  return prisma.$transaction(async (tx) => {
    const key = {
      entityHash_sourceSystem_sourceId: {
        entityHash: input.entityHash,
        sourceSystem: input.sourceSystem,
        sourceId: input.sourceId,
      },
    };

    // 1) Is this an independent (new) source assertion?
    const existingSource = await tx.entitySource.findUnique({ where: key });
    const isNewSource = existingSource === null;

    // 2) Record the source assertion (idempotent).
    await tx.entitySource.upsert({
      where: key,
      create: {
        entityHash: input.entityHash,
        sourceSystem: input.sourceSystem,
        sourceId: input.sourceId,
        payload: input.payload,
      },
      update: { payload: input.payload },
    });

    // 3) Merge canonical application-side (Prisma has no jsonb `||`).
    const current = await tx.entity.findUnique({
      where: { entityHash: input.entityHash },
      select: { canonical: true },
    });
    const mergedCanonical = {
      ...((current?.canonical as Record<string, unknown> | null) ?? {}),
      ...input.canonical,
    };

    // 4) Upsert the entity; bump trust_score only for a new independent source.
    const entity = await tx.entity.upsert({
      where: { entityHash: input.entityHash },
      create: {
        entityHash: input.entityHash,
        canonical: input.canonical as Prisma.InputJsonValue,
        trustScore: 1,
        sourceCount: 1,
      },
      update: {
        canonical: mergedCanonical as Prisma.InputJsonValue,
        ...(isNewSource
          ? { trustScore: { increment: 1 }, sourceCount: { increment: 1 } }
          : {}),
      },
      select: { entityHash: true, trustScore: true, sourceCount: true },
    });

    return entity;
  });
}
