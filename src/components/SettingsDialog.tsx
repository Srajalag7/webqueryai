import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseUrl: string;
  onSaveBaseUrl: (url: string) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  baseUrl,
  onSaveBaseUrl,
}: SettingsDialogProps) {
  const [url, setUrl] = useState(baseUrl);

  useEffect(() => {
    setUrl(baseUrl);
  }, [baseUrl]);

  const handleSave = () => {
    onSaveBaseUrl(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API base URL for the chatbot backend
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              placeholder="http://localhost:8000"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the base URL of your chat API backend
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
