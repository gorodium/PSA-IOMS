import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { EmojiForm } from "./EmojiForm";
import Image from "next/image";
import { EmojiDeleteButton } from "./EmojiDeleteButton";

export default async function CustomEmojisPage() {
  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/settings");
  }

  const emojis = await db.customEmoji.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50">Custom Emojis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload animated GIFs or static images to act as custom emojis and reactions across the chat system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Emoji</CardTitle>
            <CardDescription>Max file size is 2MB. Use short, memorable names without spaces.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmojiForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server Emojis ({emojis.length})</CardTitle>
            <CardDescription>These emojis are available to all users.</CardDescription>
          </CardHeader>
          <CardContent>
            {emojis.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No custom emojis uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {emojis.map((emoji) => (
                  <div key={emoji.id} className="relative group flex flex-col items-center gap-2 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="relative w-10 h-10">
                      <Image 
                        src={emoji.imageUrl} 
                        alt={emoji.name} 
                        fill 
                        className="object-contain" 
                        unoptimized 
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-full text-center truncate" title={`:${emoji.name}:`}>
                      :{emoji.name}:
                    </span>
                    <EmojiDeleteButton id={emoji.id} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
