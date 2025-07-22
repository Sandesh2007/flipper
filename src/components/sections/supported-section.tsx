import { FileText, Image, BookOpen } from "lucide-react";

const formats = [
  { icon: FileText, label: "PDF", color: "text-red-500" },
  { icon: Image, label: "PPT", color: "text-orange-500" },
  { icon: FileText, label: "AI", color: "text-yellow-500" },
  { icon: BookOpen, label: "DOC", color: "text-blue-500" },
  { icon: Image, label: "DOCX", color: "text-indigo-500" },
  { icon: FileText, label: "EPUB", color: "text-purple-500" },
  { icon: Image, label: "PPSX", color: "text-pink-500" },
];

export const SupportedFormats = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-sm mb-4">We support:</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {formats.map((format, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
            >
              <format.icon className={`w-4 h-4 ${format.color}`} />
              <span className="text-sm font-medium">{format.label}</span>
            </div>
          ))}
          <div className="text-primary hover:text-primary-hover transition-colors cursor-pointer">
            <span className="text-sm font-medium">and MORE</span>
          </div>
        </div>
      </div>
    </div>
  );
};