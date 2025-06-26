export interface DocumentItemProps {
  id: string;
  title: string;
  category: string;
  onDownload: () => void;
}