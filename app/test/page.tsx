import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  
  export default function TestDialogPage() {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Open Dialog
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>
                This is a minimal dialog for debugging purposes.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  