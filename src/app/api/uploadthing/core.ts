import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({pdf: {maxFileSize: "32MB"}})
    .middleware(async ({req}) => {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("Unauthorized");
        return {userId: session.user.id};
    })
    .onUploadComplete(async ({metadata, file}) => {
        // console.log("Upload complete for user", metadata.userId);
        // console.log(file)
        return {userId: metadata.userId, file}
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;