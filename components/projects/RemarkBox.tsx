import { MessageSquarePlus } from "lucide-react";
import { addProjectRemarkAction } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format";

export type RemarkItem = {
  id: string;
  remarkText: string;
  createdAt: Date;
  author: {
    name: string;
  };
};

export function RemarkBox({
  projectId,
  remarks,
  canComment
}: {
  projectId: string;
  remarks: RemarkItem[];
  canComment: boolean;
}) {
  return (
    <div className="space-y-4">
      {canComment ? (
        <form action={addProjectRemarkAction} className="space-y-3 rounded-lg border bg-white p-4">
          <input type="hidden" name="projectId" value={projectId} />
          <Textarea name="remarkText" required placeholder="Add a monitoring remark or update." />
          <Button type="submit">
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
            Add remark
          </Button>
        </form>
      ) : null}
      <div className="space-y-3">
        {remarks.length === 0 ? (
          <div className="rounded-lg border bg-white p-5 text-sm text-muted-foreground">No remarks have been recorded.</div>
        ) : (
          remarks.map((remark) => (
            <article key={remark.id} className="rounded-lg border bg-white p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-800">{remark.remarkText}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {remark.author.name} · {formatDateTime(remark.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
