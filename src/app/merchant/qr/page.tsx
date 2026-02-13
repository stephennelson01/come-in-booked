"use client";

import * as React from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, Loader2, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getMyBusiness } from "@/actions/business";

export default function MerchantQRPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [businessName, setBusinessName] = React.useState("");
  const [businessUrl, setBusinessUrl] = React.useState("");
  const [size, setSize] = React.useState(256);
  const [copied, setCopied] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    setIsLoading(true);
    const result = await getMyBusiness();
    if (result.success && result.business) {
      setBusinessName(result.business.name);
      setBusinessUrl(`https://comeinbooked.com/business/${result.business.slug}`);
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR code downloaded!");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(businessUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${businessName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            p { color: #666; margin-bottom: 24px; }
            img { max-width: 300px; }
            .url { font-size: 12px; color: #888; margin-top: 16px; word-break: break-all; max-width: 300px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${businessName}</h1>
          <p>Scan to book an appointment</p>
          <img src="${canvas.toDataURL("image/png")}" alt="QR Code" />
          <p class="url">${businessUrl}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Book at ${businessName}`,
          text: `Book your appointment at ${businessName} on ComeInBooked`,
          url: businessUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!businessUrl) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold">No business found</h2>
        <p className="text-muted-foreground">Please set up your business first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your QR Code</h1>
        <p className="text-muted-foreground">
          Share this QR code so customers can book appointments instantly
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{businessName}</CardTitle>
            <CardDescription>
              Customers can scan this code to view your services and book
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Size Selection */}
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

            {/* QR Code Display */}
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-white p-8">
              <QRCodeSVG
                value={businessUrl}
                size={Math.min(size, 280)}
                level="H"
                includeMargin
                className="rounded"
              />

              {/* Hidden canvas for download */}
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={businessUrl}
                  size={size}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Scan to book at {businessName}
              </p>
            </div>

            {/* Link Display */}
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
              <code className="flex-1 truncate text-sm">{businessUrl}</code>
              <Button
                variant="ghost"
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

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleShare} className="col-span-2">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Where to use your QR code</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>
                    <strong>Storefront window</strong> - Let walk-ins book easily
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <span>
                    <strong>Business cards</strong> - Share at networking events
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>
                    <strong>Flyers & posters</strong> - For local marketing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    4
                  </span>
                  <span>
                    <strong>Social media</strong> - Add to your Instagram bio or stories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    5
                  </span>
                  <span>
                    <strong>Reception desk</strong> - For returning customers
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-inside list-disc space-y-2">
                <li>Download the 512px version for print materials</li>
                <li>Use 128px for digital sharing and social media</li>
                <li>Test the QR code with your phone before printing</li>
                <li>Ensure good contrast - the code should be dark on a light background</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
