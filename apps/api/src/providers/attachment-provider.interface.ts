export interface AttachmentProvider {
  createLink(meta: { name: string; mimeType?: string }): Promise<{ id: string; url: string }>;
  deleteLink(id: string): Promise<void>;
}

export class LinkOnlyAttachmentProvider implements AttachmentProvider {
  async createLink(meta: { name: string }): Promise<{ id: string; url: string }> {
    return { id: `link_${Date.now()}`, url: `https://placeholder.local/${encodeURIComponent(meta.name)}` };
  }
  async deleteLink(): Promise<void> {}
}
