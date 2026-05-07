import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/content";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { blogPostSchema } from "@/lib/validators";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/utils";

export const GET = withApiHandler(
  async (_request, { params }) => {
    const { id } = await params;
    const post =
      id.length === 24 ? await BlogPost.findById(id) : await BlogPost.findOne({ slug: id });

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    return apiSuccess(post);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = blogPostSchema.partial().parse(await parseJson(request));
    const post = await BlogPost.findById(id);

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    Object.assign(post, payload);

    if (typeof payload.content === "string") {
      post.content = sanitizeRichHtml(payload.content);
    }

    if (payload.title && !payload.slug) {
      post.slug = slugify(payload.title);
    }

    await post.save();

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_blog_post",
      resource: "blog",
      resourceId: id
    });

    return apiSuccess(post);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_blog_post",
      resource: "blog",
      resourceId: id
    });

    return apiSuccess({ deleted: true });
  },
  {
    auth: "admin"
  }
);
