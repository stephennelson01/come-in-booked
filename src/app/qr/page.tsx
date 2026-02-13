"use client";

import * as React from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function QRCodePage() {
  const [url, setUrl] = React.useState("https://comeinbooked.com");
  const [size, setSize] = React.useState(256);
  const [copied, setCopied] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "comeinbooked-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR code downloaded!");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Generate a QR code for your business or the main website
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>
              Scan this code to visit ComeInBooked instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://comeinbooked.com"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="flex gap-2">
                {[128, 256, 512].map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSize(s)}
                  >
                    {s}px
                  </Button>
                ))}
              </div>
            </div>

            {/* QR Code Display */}
            <div className="flex flex-col items-center gap-6 rounded-lg border bg-white p-8">
              {/* SVG for display */}
              <QRCodeSVG
                value={url}
                size={Math.min(size, 300)}
                level="H"
                includeMargin
                className="rounded"
              />

              {/* Hidden canvas for download */}
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={url}
                  size={size}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Scan with your phone camera to visit
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(url, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
            <CardDescription>
              Generate QR codes for common pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Homepage", url: "https://comeinbooked.com" },
                { label: "Sign Up", url: "https://comeinbooked.com/sign-up" },
                { label: "Search", url: "https://comeinbooked.com/search" },
                { label: "For Business", url: "https://comeinbooked.com/sign-up?role=partner" },
              ].map((link) => (
                <Button
                  key={link.url}
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(link.url)}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 rounded-lg border bg-card p-4">
          <h3 className="font-semibold">Tips for using your QR code</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Print on business cards, flyers, or posters</li>
            <li>Display at your reception or storefront</li>
            <li>Add to your social media posts</li>
            <li>Include in email signatures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
