import { MessageSquarePlus } from "lucide-react";
import { addProjectRemarkAction } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format";
import { WidgetHeader } from "./WidgetHeader";
import type { SerializedRemark, WidgetConfig } from "@/lib/canvas-types";

interface Props {
  projectId: string;
  remarks: SerializedRemark[];
  canComment: boolean;
  config?: WidgetConfig;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}

export function RemarksWidget({ projectId, remarks, canComment, config, isEditing, onConfigChange }: Props) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <WidgetHeader
        defaultTitle="Project Remarks"
        config={config}
        isEditing={!!isEditing}
        onConfigChange={onConfigChange}
      />
      <div className="flex-1 overflow-auto p-5 space-y-4">
        {canComment && (
          <form action={addProjectRemarkAction} className="space-y-3 rounded-lg border border-border bg-muted/20 dark:bg-slate-900/50 p-4">
            <input type="hidden" name="projectId" value={projectId} />
            <Textarea name="remarkText" required placeholder="Add a monitoring remark or update." />
            <Button type="submit">
              <MessageSquarePlus className="h-4 w-4" aria-hidden />
              Add remark
            </Button>
          </form>
        )}
        {remarks.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/20 dark:bg-slate-900/50 p-5 text-sm text-muted-foreground">
            No remarks have been recorded.
          </div>
        ) : (
          <div className="space-y-3">
            {remarks.map((remark) => (
              <article key={remark.id} className="rounded-lg border border-border bg-card dark:bg-slate-900/50 p-4">
                <p className="whitespace-pre-wrap text-sm text-foreground">{remark.remarkText}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {remark.author.name} · {formatDateTime(remark.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
