import dotenv from "dotenv";
import AWS from "aws-sdk";
import { createClient } from "@sanity/client";

dotenv.config();

const requiredEnvVars = [
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_TOKEN",
  "AWS_S3_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_STORAGE_BUCKET_NAME"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || "2026-08-16",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});

const s3 = new AWS.S3();
const bucketName = String(process.env.AWS_STORAGE_BUCKET_NAME);

type TripImageDoc = {
  _id: string;
  legacyImage: string;
};

const getFileName = (imageSource: string, fallback: string) => {
  try {
    if (imageSource.startsWith("http")) {
      const url = new URL(imageSource);
      const name = url.pathname.split("/").pop();
      return name || fallback;
    }
    const fromKey = imageSource.split("/").pop();
    return fromKey || fallback;
  } catch {
    return fallback;
  }
};

const downloadLegacyImage = async (legacyImage: string): Promise<Buffer> => {
  if (legacyImage.startsWith("http://") || legacyImage.startsWith("https://")) {
    const response = await fetch(legacyImage);
    if (!response.ok) {
      throw new Error(`Failed to download image from URL: ${legacyImage}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const signedUrl = await s3.getSignedUrlPromise("getObject", {
    Bucket: bucketName,
    Key: legacyImage
  });

  const response = await fetch(signedUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image from S3 key: ${legacyImage}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

async function migrateImages() {
  const docs = await sanityClient.fetch<TripImageDoc[]>(
    '*[_type == "trip" && defined(legacyImage) && !defined(image.asset)]{_id, legacyImage}'
  );

  let migrated = 0;
  let failed = 0;

  for (const doc of docs) {
    try {
      const fileName = getFileName(doc.legacyImage, `${doc._id}.jpg`);
      const imageBuffer = await downloadLegacyImage(doc.legacyImage);

      const uploaded = await sanityClient.assets.upload("image", imageBuffer, {
        filename: fileName
      });

      await sanityClient
        .patch(doc._id)
        .set({
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploaded._id
            }
          }
        })
        .unset(["legacyImage"])
        .commit();

      migrated += 1;
      console.log(`Migrated image for ${doc._id}`);
    } catch (error) {
      failed += 1;
      console.error(`Failed image migration for ${doc._id}:`, (error as Error).message);
    }
  }

  console.log(`Image migration done. Migrated: ${migrated}, Failed: ${failed}`);
}

migrateImages().catch((error) => {
  console.error("Image migration failed:", error);
  process.exit(1);
});
