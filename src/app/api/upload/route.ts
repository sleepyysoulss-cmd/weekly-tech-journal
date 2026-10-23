
import { put } from "@vercel/blob";
import { requireWriteToken } from "@/lib/auth";
import { fail, ok, serverError } from "@/lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  try {
    const denied = requireWriteToken(req);
    if (denied) return denied;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return serverError(
        new Error("BLOB_READ_WRITE_TOKEN is not set"),
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail(
        400,
        "VALIDATION_ERROR",
        "An image file is required in the 'file' field",
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return fail(
        400,
        "VALIDATION_ERROR",
        "Only JPEG, PNG, WebP, and GIF images are allowed",
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return fail(
        400,
        "VALIDATION_ERROR",
        "Image must be larger than 0 bytes and no bigger than 5 MB",
      );
    }

    const filename = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );

    const blob = await put(
      `journal-images/${crypto.randomUUID()}-${filename}`,
      file,
      {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
        token,
      },
    );

    return ok(
      {
        url: blob.url,
        pathname: blob.pathname,
        contentType: file.type,
        size: file.size,
      },
      201,
    );
  } catch (error) {
    return serverError(error);
  }
}
