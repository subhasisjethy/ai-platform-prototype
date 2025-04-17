import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Plus } from "lucide-react";

interface BookMetadata {
  title: string;
  author: string;
  description: string;
  tags: string[];
  language: string;
  publicationDate?: string;
  publisher?: string;
}

interface BookUploadProps {
  onUploadComplete?: (file: File, metadata: BookMetadata) => void;
}

const BookUpload: React.FC<BookUploadProps> = ({
  onUploadComplete = () => {},
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<BookMetadata>({
    title: "",
    author: "",
    description: "",
    tags: [],
    language: "English",
    publicationDate: "",
    publisher: "",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Auto-fill title from filename if empty
      if (!metadata.title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setMetadata({ ...metadata, title: fileName });
      }
    }
  };

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMetadata({ ...metadata, [name]: value });
  };

  const addTag = () => {
    if (currentTag.trim() && !metadata.tags.includes(currentTag.trim())) {
      setMetadata({ ...metadata, tags: [...metadata.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata({
      ...metadata,
      tags: metadata.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploadStatus("uploading");

    try {
      // In a real implementation, you would upload the file to a server here
      // For now, we'll just simulate a successful upload after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUploadComplete(file, metadata);
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    }
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Book Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Upload Book (PDF, EPUB, TXT)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.epub,.txt"
                onChange={handleFileChange}
                className="flex-1"
                required
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          {/* Basic Metadata */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={metadata.title}
              onChange={handleMetadataChange}
              placeholder="Book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={metadata.author}
              onChange={handleMetadataChange}
              placeholder="Author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
              placeholder="Brief description of the book"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {metadata.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                name="language"
                value={metadata.language}
                onChange={handleMetadataChange}
                placeholder="e.g., English"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                name="publicationDate"
                type="date"
                value={metadata.publicationDate}
                onChange={handleMetadataChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                value={metadata.publisher}
                onChange={handleMetadataChange}
                placeholder="Publisher name"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!file || uploadStatus === "uploading"}
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload Book"}
          </Button>

          {uploadStatus === "success" && (
            <div className="p-2 bg-green-50 text-green-700 rounded-md text-sm">
              Book uploaded successfully!
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-2 bg-red-50 text-red-700 rounded-md text-sm">
              Upload failed. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BookUpload;
