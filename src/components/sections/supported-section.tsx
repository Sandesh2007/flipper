import { FileText, Image, BookOpen, Sparkles, CheckCircle } from "lucide-react";

const formats = [
  { icon: FileText, label: "PDF", color: "text-red-500", description: "Most popular format" },
  { icon: Image, label: "PPT", color: "text-orange-500", description: "PowerPoint presentations" },
  { icon: FileText, label: "AI", color: "text-yellow-500", description: "Adobe Illustrator files" },
  { icon: BookOpen, label: "DOC", color: "text-blue-500", description: "Word documents" },
  { icon: Image, label: "DOCX", color: "text-indigo-500", description: "Modern Word format" },
  { icon: FileText, label: "EPUB", color: "text-purple-500", description: "E-book format" },
  { icon: Image, label: "PPSX", color: "text-pink-500", description: "PowerPoint shows" },
];

export const SupportedFormats = () => {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-500/20 mb-6 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">Wide format support</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-500">
            Supported Formats
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert your documents from various formats into beautiful interactive flipbooks
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {formats.map((format, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl glass border border-border/50  hover:scale-105 card-hover text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${format.color.replace('text-', '')}/10 to-${format.color.replace('text-', '')}/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <format.icon className={`w-6 h-6 ${format.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{format.label}</h3>
              <p className="text-xs text-muted-foreground">{format.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-100 border border-blue-500/20  hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:animate-pulse" />
            <span className="text-sm font-medium text-blue-500">And many more formats supported</span>
          </div>
        </div>
      </div>
    </section>
  );
};