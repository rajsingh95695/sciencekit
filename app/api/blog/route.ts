import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/content";
import { logAdminAction } from "@/lib/logger";
import { blogPostSchema } from "@/lib/validators";
import BlogPost from "@/models/BlogPost";
import { slugify } from "@/lib/utils";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const posts = await BlogPost.find(all ? {} : { published: true }).sort({ createdAt: -1 }).lean();
    return apiSuccess(posts);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = blogPostSchema.parse(await parseJson(request));
    const post = await BlogPost.create({
      ...payload,
      content: sanitizeRichHtml(payload.content),
      slug: payload.slug || slugify(payload.title)
    });

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_blog_post",
      resource: "blog",
      resourceId: post._id.toString()
    });

    return apiSuccess(post, { status: 201 });
  },
  {
    auth: "admin"
  }
);
