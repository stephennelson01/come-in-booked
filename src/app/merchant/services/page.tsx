"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, MoreHorizontal, Clock, Pencil, Trash2, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getMyServices,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  type Service,
} from "@/actions/services";
import { uploadServiceImage } from "@/lib/upload";
import { getMyBusiness } from "@/actions/business";

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    category: "",
    image_url: "" as string | null,
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [businessId, setBusinessId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  // Load services and business
  React.useEffect(() => {
    loadServices();
    loadBusiness();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    const result = await getMyServices();
    if (result.success && result.services) {
      setServices(result.services);
    } else if (result.error) {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const loadBusiness = async () => {
    const result = await getMyBusiness();
    if (result.success && result.business) {
      setBusinessId(result.business.id);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, WebP, or GIF image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration_minutes: "",
      price: "",
      category: "",
      image_url: null,
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.duration_minutes || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = null;

    // Upload image if selected
    if (imageFile && businessId) {
      setIsUploading(true);
      const uploadResult = await uploadServiceImage(imageFile, businessId);
      setIsUploading(false);

      if (uploadResult.error) {
        toast.error(uploadResult.error);
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadResult.url;
    }

    const result = await createService({
      name: formData.name,
      description: formData.description || undefined,
      duration_minutes: parseInt(formData.duration_minutes),
      price: parseFloat(formData.price),
      category: formData.category || undefined,
      image_url: imageUrl,
    });

    if (result.success) {
      toast.success("Service created successfully");
      setIsDialogOpen(false);
      resetForm();
      loadServices();
    } else {
      toast.error(result.error || "Failed to create service");
    }
    setIsSubmitting(false);
  };

  const handleEdit = async () => {
    if (!selectedService || !formData.name || !formData.duration_minutes || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null | undefined = undefined;

    // Upload new image if selected
    if (imageFile && businessId) {
      setIsUploading(true);
      const uploadResult = await uploadServiceImage(imageFile, businessId);
      setIsUploading(false);

      if (uploadResult.error) {
        toast.error(uploadResult.error);
        setIsSubmitting(false);
        return;
      }
      imageUrl = uploadResult.url;
    } else if (formData.image_url === null && selectedService.image_url) {
      // Image was removed
      imageUrl = null;
    }

    const updateData: Parameters<typeof updateService>[1] = {
      name: formData.name,
      description: formData.description || undefined,
      duration_minutes: parseInt(formData.duration_minutes),
      price: parseFloat(formData.price),
      category: formData.category || undefined,
    };

    if (imageUrl !== undefined) {
      updateData.image_url = imageUrl;
    }

    const result = await updateService(selectedService.id, updateData);

    if (result.success) {
      toast.success("Service updated successfully");
      setIsEditDialogOpen(false);
      setSelectedService(null);
      resetForm();
      loadServices();
    } else {
      toast.error(result.error || "Failed to update service");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    setIsSubmitting(true);
    const result = await deleteService(selectedService.id);

    if (result.success) {
      toast.success("Service deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      loadServices();
    } else {
      toast.error(result.error || "Failed to delete service");
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string) => {
    const result = await toggleServiceActive(id);
    if (result.success) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: result.is_active ?? s.is_active } : s
        )
      );
      toast.success(result.is_active ? "Service activated" : "Service deactivated");
    } else {
      toast.error(result.error || "Failed to update service");
    }
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      duration_minutes: service.duration_minutes.toString(),
      price: service.price.toString(),
      category: service.category || "",
      image_url: service.image_url,
    });
    setImagePreview(service.image_url);
    setImageFile(null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings and pricing
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service for your customers to book
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Box Braids"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="5000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Braiding, Styling, Treatments"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Create Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">
              You haven&apos;t added any services yet
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  onToggle={handleToggle}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services
                  .filter((s) => s.category === category)
                  .map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      onToggle={handleToggle}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Uncategorized services */}
      {services.some((s) => !s.category) && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services
                .filter((s) => !s.category)
                .map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    onToggle={handleToggle}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setSelectedService(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Service Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₦) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Service Image</Label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
                id="edit-image-input"
              />
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreview}
                    alt="Service preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="edit-image-input"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF (max 5MB)</p>
                </label>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedService?.name}&rdquo;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedService(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ServiceRow({
  service,
  onToggle,
  onEdit,
  onDelete,
}: {
  service: Service;
  onToggle: (id: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex gap-4 flex-1">
        {service.image_url ? (
          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{service.name}</h3>
            {!service.is_active && (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
          {service.description && (
            <p className="text-sm text-muted-foreground truncate">
              {service.description}
            </p>
          )}
          <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {service.duration_minutes} min
            </span>
            <span className="flex items-center gap-1">
              ₦{service.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          checked={service.is_active}
          onCheckedChange={() => onToggle(service.id)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(service)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(service)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
