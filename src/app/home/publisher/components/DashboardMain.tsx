"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import InfoDialog from "./dialog"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { createClient } from "@/lib/database/supabase/client"
import { FileText, Eye, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import { usePdfUpload } from '@/components';

interface Publication {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumb_url: string | null;
  created_at: string;
  user_id: string;
}

export default function DashboardMain() {
  const router = useRouter();
  const { user } = useAuth();
  const { setPdf } = usePdfUpload();
  const [activeTab, setActiveTab] = useState("Publications")
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ["Publications", "Articles", "Social posts"]

  useEffect(() => {
    const fetchPublications = async () => {
      if (!user) return;
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // ofc limit the number of publications ^_^
      
      if (!error && data) {
        setPublications(data);
      }
      setLoading(false);
    };

    fetchPublications();
  }, [user]);

  const handleDelete = async (pubId: string) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;
    
    const supabase = createClient();
    const { error } = await supabase.from('publications').delete().eq('id', pubId);
    
    if (!error) {
      setPublications(prev => prev.filter(pub => pub.id !== pubId));
    }
  };

  // Add a handler for file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPdf({ file, name: file.name, lastModified: file.lastModified });
      router.push('/home/create');
    }
  };

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8">
      <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
        {/* Mobile Layout - No drag & drop section */}
        <div className="block lg:hidden">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Add a file</h1>
            <Button className="w-full sm:w-auto bg-neutral-300 cursor-pointer dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600" onClick={() => router.push('/home/create')}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
              Upload a file
            </Button>
            <input
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              ref={el => {
                // @ts-ignore
                if (el) window.fileInputRef = el;
              }}
              onChange={handleFileSelect}
            />
            <div className="mt-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Supported:&nbsp;
                <Tooltip>
                  <TooltipTrigger className="underline cursor-pointer">file types</TooltipTrigger>
                  <TooltipContent className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white rounded-md">
                    <p>.pdf, .doc, .docx, .pptx</p>
                  </TooltipContent>
                </Tooltip>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <InfoDialog />
            </div>
          </div>
        </div>
        {/* Desktop Layout - With drag & drop */}
        <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Add a file</h1>
            <Button className="bg-neutral-300 dark:bg-neutral-700 cursor-pointer hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600" onClick={() => router.push('/home/create')}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
              Upload a file
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Drag & Drop</h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Upload a .pdf or other&nbsp;
              <Tooltip>
                <TooltipTrigger className="underline cursor-pointer">file types</TooltipTrigger>
                <TooltipContent className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white rounded-md">
                  <p>.pdf, .doc, .docx, .pptx</p>
                </TooltipContent>
              </Tooltip>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InfoDialog />
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Recent Work</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 lg:mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="outline"
              size="sm"
              className={`
                text-xs sm:text-sm
                ${
                  activeTab === tab
                    ? "bg-neutral-300 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100"
                    : "border-neutral-400 dark:border-neutral-600 text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                }
              `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
        <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
          <CardContent className="p-4 sm:p-6">
            {activeTab === "Publications" && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 dark:border-neutral-400 mx-auto mb-4"></div>
                    <p className="text-neutral-500 dark:text-neutral-400">Loading publications...</p>
                  </div>
                ) : publications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Publications Yet</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">Start by creating your first publication.</p>
                    <Button onClick={() => router.push('/home/create')}>
                      Create Publication
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Your Publications ({publications.length})</h3>
                      <Link href="/profile">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {publications.map((pub) => (
                        <div key={pub.id} className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          {pub.thumb_url ? (
                            <Image 
                              src={pub.thumb_url} 
                              alt="Thumbnail" 
                              width={64}
                              height={80}
                              className="w-16 h-20 object-cover rounded border border-neutral-200 dark:border-neutral-600"
                            />
                          ) : (
                            <div className="w-16 h-20 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-600">
                              <FileText className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base truncate">{pub.title}</h4>
                            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm truncate mb-1">
                              {pub.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(pub.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(pub.pdf_url, '_blank')}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/profile?edit=${pub.id}`)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(pub.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "Articles" && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Your Articles</h3>
                <p className="text-neutral-500 dark:text-neutral-400">List of your articles will appear here.</p>
              </div>
            )}
            {activeTab === "Social posts" && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Your Social Posts</h3>
                <p className="text-neutral-500 dark:text-neutral-400">List of your social posts will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
} 